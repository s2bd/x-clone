import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: 'fa-house' },
    { name: 'Explore', href: '/explore', icon: 'fa-hashtag' },
    { name: 'Notifications', href: '/notifications', icon: 'fa-bell' },
    { name: 'Messages', href: '/messages', icon: 'fa-envelope' },
    { name: 'Bookmarks', href: '/bookmarks', icon: 'fa-bookmark' },
    { name: 'Profile', href: `/profile/${user?.username}`, icon: 'fa-user' },
    { name: 'Settings', href: '/settings', icon: 'fa-gear' },
  ]

  return (
    <div className="w-64 p-6 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <Link to="/" className="mb-8">
        <div className="text-4xl font-display font-bold text-gray-900 hover:text-primary transition-colors duration-200 transform hover:scale-110">
          𝕫
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`sidebar-link ${
                    isActive ? 'text-primary bg-red-50' : ''
                  }`}
                >
                  <i className={`fas ${item.icon} text-xl`}></i>
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Zing Button */}
        <button className="btn-primary w-full mt-6 py-3 text-lg font-display">
          Zing!
        </button>
      </nav>

      {/* User Menu */}
      <div className="mt-auto">
        <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <img
            src={user?.avatar || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.displayName}
            </p>
            <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-600"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar