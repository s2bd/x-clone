import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { postsAPI, usersAPI } from '../services/api'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('posts') // 'posts' or 'users'

  const { data: trendingPosts, isLoading: loadingTrending } = useQuery(
    'trending-posts',
    postsAPI.getTrending,
    {
      select: (response) => response.data.posts,
    }
  )

  const { data: searchResults, isLoading: loadingSearch } = useQuery(
    ['search', searchType, searchQuery],
    () => {
      if (searchType === 'posts') {
        return postsAPI.search(searchQuery)
      } else {
        return usersAPI.search(searchQuery)
      }
    },
    {
      enabled: searchQuery.length > 0,
      select: (response) => response.data,
    }
  )

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is triggered automatically by the query
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold mb-4">Explore</h1>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Z..."
              className="input-field pl-10"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setSearchType('posts')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchType === 'posts'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Posts
            </button>
            <button
              type="button"
              onClick={() => setSearchType('users')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchType === 'users'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users
            </button>
          </div>
        </form>
      </div>

      {/* Content */}
      <div>
        {searchQuery ? (
          // Search Results
          <div>
            {loadingSearch ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="large" />
              </div>
            ) : searchResults ? (
              searchType === 'posts' ? (
                searchResults.posts?.length > 0 ? (
                  searchResults.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No posts found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                searchResults.users?.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {searchResults.users.map((user) => (
                      <div key={user._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || 'https://via.placeholder.com/40'}
                              alt={user.displayName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="flex items-center space-x-1">
                                <p className="font-semibold text-gray-900">{user.displayName}</p>
                                {user.verified && (
                                  <div className="verified-badge">
                                    <i className="fas fa-certificate text-primary"></i>
                                    <i className="fas fa-check text-white absolute inset-0 flex items-center justify-center text-xs"></i>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-500">@{user.username}</p>
                              {user.bio && (
                                <p className="text-gray-700 text-sm mt-1">{user.bio}</p>
                              )}
                            </div>
                          </div>
                          <button className="btn-secondary text-sm px-4 py-1">
                            Follow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No users found for "{searchQuery}"</p>
                  </div>
                )
              )
            ) : null}
          </div>
        ) : (
          // Trending Posts
          <div>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-display font-semibold">Trending</h2>
            </div>
            
            {loadingTrending ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="large" />
              </div>
            ) : trendingPosts?.length > 0 ? (
              trendingPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No trending posts available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore