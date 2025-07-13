import React from 'react'

const Bookmarks = () => {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">Bookmarks</h1>
      </div>

      {/* Empty State */}
      <div className="p-8 text-center text-gray-500">
        <i className="fas fa-bookmark text-6xl mb-6"></i>
        <h2 className="text-2xl font-display font-semibold mb-4">Save posts for later</h2>
        <p className="text-lg mb-2">Bookmark posts to easily find them again</p>
        <p>Your bookmarks will appear here</p>
      </div>
    </div>
  )
}

export default Bookmarks