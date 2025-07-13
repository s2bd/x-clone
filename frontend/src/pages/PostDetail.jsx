import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { postsAPI } from '../services/api'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import LoadingSpinner from '../components/LoadingSpinner'

const PostDetail = () => {
  const { postId } = useParams()

  const { data, isLoading, error, refetch } = useQuery(
    ['post', postId],
    () => postsAPI.getPost(postId),
    {
      select: (response) => response.data,
    }
  )

  const handleReplyCreated = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Post not found</p>
      </div>
    )
  }

  const { post, replies } = data

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">Post</h1>
      </div>

      {/* Main Post */}
      <PostCard post={post} />

      {/* Reply Form */}
      <CreatePost replyTo={post._id} onPostCreated={handleReplyCreated} />

      {/* Replies */}
      <div>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <PostCard key={reply._id} post={reply} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No replies yet</p>
            <p className="mt-2">Be the first to reply!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetail