import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email')
      .populate('followers', 'username displayName avatar verified')
      .populate('following', 'username displayName avatar verified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user is following this user
    const isFollowing = req.user ? user.followers.some(follower => 
      follower._id.toString() === req.user._id.toString()
    ) : false;

    // Get user's posts
    const posts = await Post.find({ author: user._id })
      .populate('author', 'username displayName avatar verified')
      .populate('originalPost')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      user: {
        ...user.toJSON(),
        isFollowing,
        postCount: posts.length
      },
      posts
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('displayName').optional().isLength({ min: 1, max: 50 }),
  body('bio').optional().isLength({ max: 160 }),
  body('location').optional().isLength({ max: 50 }),
  body('website').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { displayName, bio, location, website, avatar, banner } = req.body;
    
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (banner !== undefined) updateData.banner = banner;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow/Unfollow user
router.post('/:username/follow', authenticateToken, async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username });
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);

      // Create notification
      const notification = new Notification({
        recipient: targetUser._id,
        sender: currentUser._id,
        type: 'follow',
        message: `${currentUser.displayName} started following you`
      });
      await notification.save();
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({ 
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's followers
router.get('/:username/followers', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username displayName avatar verified bio followerCount followingCount');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's following
router.get('/:username/following', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('following', 'username displayName avatar verified bio followerCount followingCount');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username displayName avatar verified bio followerCount')
    .limit(20);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;