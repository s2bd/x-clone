import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { postsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery(
    ['feed', page],
    () => postsAPI.getFeed(page),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    }
  )

  const handlePostCreated = () => {
    queryClient.invalidateQueries(['feed'])
    toast.success('Post created successfully!')
  }

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error loading feed. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">Home</h1>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Feed */}
      <div>
        {data?.posts?.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        
        {data?.posts?.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No posts in your feed yet.</p>
            <p className="mt-2">Follow some users to see their posts here!</p>
          </div>
        )}

        {/* Load More */}
        {data?.hasMore && (
          <div className="p-4 text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="btn-secondary"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home