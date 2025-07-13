import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { usersAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery(
    ['profile', username],
    () => usersAPI.getProfile(username),
    {
      select: (response) => response.data,
    }
  )

  const followMutation = useMutation(usersAPI.follow, {
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', username])
      toast.success(data?.user?.isFollowing ? 'Unfollowed' : 'Followed')
    },
    onError: () => {
      toast.error('Failed to update follow status')
    }
  })

  const handleFollow = () => {
    followMutation.mutate(username)
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
        <p className="text-red-600">User not found</p>
      </div>
    )
  }

  const { user, posts } = data
  const isOwnProfile = currentUser?.username === username

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">{user.displayName}</h1>
        <p className="text-sm text-gray-500">{user.postCount} posts</p>
      </div>

      {/* Profile Header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-primary to-primary-light">
          {user.banner && (
            <img
              src={user.banner}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <img
              src={user.avatar || 'https://via.placeholder.com/128'}
              alt={user.displayName}
              className="w-32 h-32 rounded-full border-4 border-white bg-white"
            />
            
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={followMutation.isLoading}
                className={`mt-16 px-6 py-2 rounded-full font-semibold transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600'
                    : 'btn-primary'
                }`}
              >
                {followMutation.isLoading ? (
                  <LoadingSpinner size="small" />
                ) : user.isFollowing ? (
                  'Following'
                ) : (
                  'Follow'
                )}
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center">
                {user.displayName}
                {user.verified && (
                  <div className="verified-badge ml-2">
                    <i className="fas fa-certificate text-primary"></i>
                    <i className="fas fa-check text-white absolute inset-0 flex items-center justify-center text-xs"></i>
                  </div>
                )}
              </h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            {user.bio && (
              <p className="text-gray-900">{user.bio}</p>
            )}

            <div className="flex items-center space-x-4 text-gray-500">
              {user.location && (
                <div className="flex items-center space-x-1">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center space-x-1">
                  <i className="fas fa-link"></i>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <i className="fas fa-calendar"></i>
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{user.followingCount}</span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{user.followerCount}</span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="border-t border-gray-200">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile