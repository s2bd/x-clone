import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import { postsAPI, uploadAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const CreatePost = ({ onPostCreated, replyTo = null }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const createPostMutation = useMutation(postsAPI.create, {
    onSuccess: () => {
      setContent('')
      setImages([])
      onPostCreated?.()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create post')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    const postData = {
      content: content.trim(),
      images,
      replyTo
    }

    createPostMutation.mutate(postData)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = files.map(file => uploadAPI.image(file))
      const responses = await Promise.all(uploadPromises)
      const imageUrls = responses.map(response => response.data.url)
      setImages(prev => [...prev, ...imageUrls])
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const isLoading = createPostMutation.isLoading || uploading

  return (
    <div className="border-b border-gray-200 p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={user?.avatar || 'https://via.placeholder.com/40'}
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyTo ? "Post your reply" : "What's happening?"}
              className="w-full text-xl placeholder-gray-500 border-none resize-none focus:outline-none"
              rows={3}
              maxLength={280}
            />

            {/* Image previews */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt="Upload preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer text-primary hover:text-primary-hover">
                  <i className="far fa-image text-xl"></i>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
                
                <span className="text-sm text-gray-500">
                  {280 - content.length} characters remaining
                </span>
              </div>

              <button
                type="submit"
                disabled={!content.trim() || isLoading}
                className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && <LoadingSpinner size="small" />}
                <span>{replyTo ? 'Reply' : 'Zing'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreatePost