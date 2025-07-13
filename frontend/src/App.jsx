import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import PostDetail from './pages/PostDetail'
import Explore from './pages/Explore'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import Bookmarks from './pages/Bookmarks'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/" replace />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="settings" element={<Settings />} />
        <Route path="post/:postId" element={<PostDetail />} />
        <Route path="profile/:username" element={<Profile />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App