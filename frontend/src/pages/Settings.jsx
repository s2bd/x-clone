import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import { usersAPI, uploadAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [uploading, setUploading] = useState({ avatar: false, banner: false })
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    }
  })

  const updateProfileMutation = useMutation(usersAPI.updateProfile, {
    onSuccess: (response) => {
      updateUser(response.data.user)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  const handleImageUpload = async (type, file) => {
    if (!file) return

    setUploading(prev => ({ ...prev, [type]: true }))
    try {
      const uploadFn = type === 'avatar' ? uploadAPI.avatar : uploadAPI.banner
      const response = await uploadFn(file)
      
      const updateData = { [type]: response.data.url }
      await updateProfileMutation.mutateAsync(updateData)
      
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} updated successfully!`)
    } catch (error) {
      toast.error(`Failed to upload ${type}`)
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-display font-bold">Settings</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Profile Pictures */}
        <div className="space-y-6">
          <h2 className="text-lg font-display font-semibold">Profile Pictures</h2>
          
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || 'https://via.placeholder.com/80'}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <label className="btn-secondary cursor-pointer">
                {uploading.avatar ? <LoadingSpinner size="small" /> : 'Change Avatar'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('avatar', e.target.files[0])}
                  className="hidden"
                  disabled={uploading.avatar}
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">Recommended: 400x400px</p>
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <div className="h-32 bg-gradient-to-r from-primary to-primary-light rounded-lg overflow-hidden">
              {user?.banner && (
                <img
                  src={user.banner}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label className="btn-secondary cursor-pointer inline-block">
              {uploading.banner ? <LoadingSpinner size="small" /> : 'Change Banner'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('banner', e.target.files[0])}
                className="hidden"
                disabled={uploading.banner}
              />
            </label>
            <p className="text-sm text-gray-500">Recommended: 1500x500px</p>
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-lg font-display font-semibold">Profile Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              {...register('displayName', { 
                required: 'Display name is required',
                maxLength: { value: 50, message: 'Display name must be less than 50 characters' }
              })}
              className="input-field"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              {...register('bio', { 
                maxLength: { value: 160, message: 'Bio must be less than 160 characters' }
              })}
              rows={3}
              className="input-field resize-none"
              placeholder="Tell us about yourself"
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              {...register('location', { 
                maxLength: { value: 50, message: 'Location must be less than 50 characters' }
              })}
              className="input-field"
              placeholder="Where are you located?"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              {...register('website', { 
                maxLength: { value: 100, message: 'Website URL must be less than 100 characters' }
              })}
              className="input-field"
              placeholder="https://yourwebsite.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            {updateProfileMutation.isLoading && <LoadingSpinner size="small" />}
            <span>Save Changes</span>
          </button>
        </form>

        {/* Account Information */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-display font-semibold">Account Information</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">@{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Joined:</span>
              <span className="font-medium">
                {user?.joinDate && new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings