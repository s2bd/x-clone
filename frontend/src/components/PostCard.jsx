import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { postsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const PostCard = ({ post }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const likeMutation = useMutation(postsAPI.like, {
    onSuccess: () => {
      queryClient.invalidateQueries(['feed'])
      queryClient.invalidateQueries(['post', post._id])
    },
    onError: () => {
      toast.error('Failed to like post')
    }
  })

  const repostMutation = useMutation(postsAPI.repost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['feed'])
      toast.success('Post reposted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to repost')
    }
  })

  const handleLike = () => {
    likeMutation.mutate(post._id)
  }

  const handleRepost = () => {
    repostMutation.mutate(post._id)
  }

  const isLiked = post.likes?.includes(user?._id)
  const displayPost = post.isRepost ? post.originalPost : post

  return (
    <div className="post-card">
      {/* Repost indicator */}
      {post.isRepost && (
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <i className="fas fa-retweet mr-2"></i>
          <span>{post.author.displayName} reposted</span>
        </div>
      )}

      <div className="flex space-x-3">
        {/* Avatar */}
        <Link to={`/profile/${displayPost.author.username}`}>
          <img
            src={displayPost.author.avatar || 'https://via.placeholder.com/40'}
            alt={displayPost.author.displayName}
            className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* User info */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${displayPost.author.username}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {displayPost.author.displayName}
            </Link>
            {displayPost.author.verified && (
              <div className="verified-badge">
                <i className="fas fa-certificate text-primary"></i>
                <i className="fas fa-check text-white absolute inset-0 flex items-center justify-center text-xs"></i>
              </div>
            )}
            <span className="text-gray-500">@{displayPost.author.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(displayPost.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Content */}
          <Link to={`/post/${displayPost._id}`}>
            <div className="mt-2">
              <p className="text-gray-900 whitespace-pre-wrap">{displayPost.content}</p>
              
              {/* Images */}
              {displayPost.images && displayPost.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
                  {displayPost.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Post image"
                      className="w-full h-48 object-cover hover:opacity-95 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <i className="far fa-comment"></i>
              <span className="text-sm">{displayPost.replyCount || 0}</span>
            </button>

            <button
              onClick={handleRepost}
              disabled={repostMutation.isLoading}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <i className="fas fa-retweet"></i>
              <span className="text-sm">{displayPost.repostCount || 0}</span>
            </button>

            <button
              onClick={handleLike}
              disabled={likeMutation.isLoading}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <i className={isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
              <span className="text-sm">{displayPost.likeCount || 0}</span>
            </button>

            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <i className="far fa-share"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard