import React from 'react'

const Notifications = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: { displayName: 'John Doe', username: 'johndoe', avatar: null },
      message: 'liked your post',
      time: '2h',
      read: false
    },
    {
      id: 2,
      type: 'follow',
      user: { displayName: 'Jane Smith', username: 'janesmith', avatar: null },
      message: 'started following you',
      time: '4h',
      read: false
    },
    {
      id: 3,
      type: 'repost',
      user: { displayName: 'Mike Johnson', username: 'mikej', avatar: null },
      message: 'reposted your post',
      time: '1d',
      read: true
    }
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return 'fas fa-heart text-red-500'
      case 'follow':
        return 'fas fa-user-plus text-blue-500'
      case 'repost':
        return 'fas fa-retweet text-green-500'
      case 'reply':
        return 'fas fa-reply text-blue-500'
      case 'mention':
        return 'fas fa-at text-purple-500'
      default:
        return 'fas fa-bell text-gray-500'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <i className={`${getNotificationIcon(notification.type)} text-lg`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <img
                      src={notification.user.avatar || 'https://via.placeholder.com/32'}
                      alt={notification.user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.displayName}</span>
                        <span className="text-gray-600"> {notification.message}</span>
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>

                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <i className="fas fa-bell text-4xl mb-4"></i>
            <p>No notifications yet</p>
            <p className="mt-2">When someone interacts with your posts, you'll see it here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications