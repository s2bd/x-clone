import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create a new post
router.post('/', authenticateToken, [
  body('content').isLength({ min: 1, max: 280 }).withMessage('Content must be 1-280 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, images, replyTo } = req.body;

    // Extract hashtags and mentions
    const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1).toLowerCase()) || [];
    const mentionMatches = content.match(/@\w+/g) || [];
    
    // Find mentioned users
    const mentions = [];
    for (const mention of mentionMatches) {
      const username = mention.slice(1);
      const user = await User.findOne({ username });
      if (user) {
        mentions.push(user._id);
      }
    }

    const post = new Post({
      author: req.user._id,
      content,
      images: images || [],
      hashtags,
      mentions,
      replyTo: replyTo || null
    });

    await post.save();

    // If it's a reply, add to parent post's replies
    if (replyTo) {
      await Post.findByIdAndUpdate(replyTo, {
        $push: { replies: post._id }
      });

      // Create notification for original post author
      const originalPost = await Post.findById(replyTo).populate('author');
      if (originalPost && originalPost.author._id.toString() !== req.user._id.toString()) {
        const notification = new Notification({
          recipient: originalPost.author._id,
          sender: req.user._id,
          type: 'reply',
          post: post._id,
          message: `${req.user.displayName} replied to your post`
        });
        await notification.save();
      }
    }

    // Create notifications for mentions
    for (const mentionedUserId of mentions) {
      if (mentionedUserId.toString() !== req.user._id.toString()) {
        const notification = new Notification({
          recipient: mentionedUserId,
          sender: req.user._id,
          type: 'mention',
          post: post._id,
          message: `${req.user.displayName} mentioned you in a post`
        });
        await notification.save();
      }
    }

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username displayName avatar verified');

    res.status(201).json({ message: 'Post created successfully', post: populatedPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feed posts
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get posts from followed users and own posts
    const followingIds = req.user.following;
    const userIds = [...followingIds, req.user._id];

    const posts = await Post.find({ 
      author: { $in: userIds },
      replyTo: null // Only get main posts, not replies
    })
    .populate('author', 'username displayName avatar verified')
    .populate('originalPost')
    .populate({
      path: 'originalPost',
      populate: {
        path: 'author',
        select: 'username displayName avatar verified'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({ posts, page, hasMore: posts.length === limit });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending posts
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const posts = await Post.find({ replyTo: null })
      .populate('author', 'username displayName avatar verified')
      .sort({ 
        likeCount: -1, 
        repostCount: -1, 
        createdAt: -1 
      })
      .limit(20);

    res.json({ posts });
  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post with replies
router.get('/:postId', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username displayName avatar verified')
      .populate('originalPost')
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          select: 'username displayName avatar verified'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get replies
    const replies = await Post.find({ replyTo: post._id })
      .populate('author', 'username displayName avatar verified')
      .sort({ createdAt: 1 });

    res.json({ post, replies });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);

      // Create notification if not own post
      if (post.author.toString() !== req.user._id.toString()) {
        const notification = new Notification({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          post: post._id,
          message: `${req.user.displayName} liked your post`
        });
        await notification.save();
      }
    }

    await post.save();

    res.json({ 
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Repost
router.post('/:postId/repost', authenticateToken, async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.postId);
    
    if (!originalPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already reposted
    const existingRepost = await Post.findOne({
      author: req.user._id,
      originalPost: originalPost._id,
      isRepost: true
    });

    if (existingRepost) {
      return res.status(400).json({ message: 'Already reposted' });
    }

    // Create repost
    const repost = new Post({
      author: req.user._id,
      content: '',
      isRepost: true,
      originalPost: originalPost._id
    });

    await repost.save();

    // Add to original post's reposts
    originalPost.reposts.push({
      user: req.user._id,
      createdAt: new Date()
    });
    await originalPost.save();

    // Create notification
    if (originalPost.author.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: originalPost.author,
        sender: req.user._id,
        type: 'repost',
        post: originalPost._id,
        message: `${req.user.displayName} reposted your post`
      });
      await notification.save();
    }

    const populatedRepost = await Post.findById(repost._id)
      .populate('author', 'username displayName avatar verified')
      .populate('originalPost')
      .populate({
        path: 'originalPost',
        populate: {
          path: 'author',
          select: 'username displayName avatar verified'
        }
      });

    res.status(201).json({ message: 'Post reposted successfully', post: populatedRepost });
  } catch (error) {
    console.error('Repost error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search posts
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const posts = await Post.find({
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { hashtags: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('author', 'username displayName avatar verified')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({ posts });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;