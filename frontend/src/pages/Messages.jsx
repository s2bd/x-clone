import React from 'react'

const Messages = () => {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">Messages</h1>
      </div>

      {/* Coming Soon */}
      <div className="p-8 text-center text-gray-500">
        <i className="fas fa-envelope text-6xl mb-6"></i>
        <h2 className="text-2xl font-display font-semibold mb-4">Messages Coming Soon</h2>
        <p className="text-lg mb-2">Direct messaging feature is under development</p>
        <p>Stay tuned for updates!</p>
      </div>
    </div>
  )
}

export default Messages