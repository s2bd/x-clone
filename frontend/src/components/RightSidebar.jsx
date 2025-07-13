import React from 'react'
import { useQuery } from 'react-query'
import { postsAPI } from '../services/api'

const RightSidebar = () => {
  const { data: trendingPosts } = useQuery(
    'trending-posts',
    postsAPI.getTrending,
    {
      select: (response) => response.data.posts.slice(0, 5),
    }
  )

  const trends = [
    { tag: '#XisDead', posts: '12K' },
    { tag: '#MuxAnime', posts: '8.9K' },
    { tag: '#BRACU', posts: '15K' },
    { tag: '#StudioGhibli', posts: '20K' },
  ]

  const whoToFollow = [
    { username: 'dewanmukto', displayName: 'Dewan Mukto' },
    { username: 'muxai', displayName: 'Mux AI' },
    { username: 'bongojukti', displayName: 'Bongo Jukti' },
  ]

  return (
    <div className="w-80 p-6 space-y-6">
      {/* Trends */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-xl font-display font-semibold mb-4">Trends for you</h3>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div key={index} className="hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer">
              <p className="font-semibold text-primary">{trend.tag}</p>
              <p className="text-sm text-gray-500">{trend.posts} Zings</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-xl font-display font-semibold mb-4">Who to follow</h3>
        <div className="space-y-3">
          {whoToFollow.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://via.placeholder.com/40?text=${user.username[0].toUpperCase()}`}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{user.displayName}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <button className="btn-secondary text-sm px-4 py-1">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      {trendingPosts && trendingPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-xl font-display font-semibold mb-4">Trending</h3>
          <div className="space-y-3">
            {trendingPosts.map((post) => (
              <div key={post._id} className="hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer">
                <p className="text-sm text-gray-900 line-clamp-2">{post.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {post.likeCount} likes • {post.repostCount} reposts
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RightSidebar