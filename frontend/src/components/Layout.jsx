import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto flex">
        <Sidebar />
        <main className="flex-1 max-w-2xl border-x border-gray-200 bg-white min-h-screen">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}

export default Layout