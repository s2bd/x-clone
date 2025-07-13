import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reposts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  hashtags: [{
    type: String
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRepost: {
    type: Boolean,
    default: false
  },
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
}, {
  timestamps: true
});

// Index for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for repost count
postSchema.virtual('repostCount').get(function() {
  return this.reposts.length;
});

// Virtual for reply count
postSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Post', postSchema);