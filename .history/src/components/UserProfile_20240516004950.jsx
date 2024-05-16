import React, { useState, useEffect } from 'react'
import './UserProfile.css'

function UserProfile({ onProfileUpdate }) {
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/get-profile')
        const data = await response.json()
        if (response.ok) {
          setUsername(data.username || '')
          setAddress(data.address || '')
          setDescription(data.description || '')
          setAvatar(data.avatar) // 这里假设服务器返回的是头像的URL
        } else {
          throw new Error(data.message || 'Failed to fetch profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0])
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('username', username)
    formData.append('address', address)
    formData.append('description', description)
    formData.append('password', password)

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        onProfileUpdate(data)
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    }
  }

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={handleAddressChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe yourself here..."
            disabled={!isEditing}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            disabled={!isEditing}
          />
        </div>
        {!isEditing ? (
          <button
            type="button"
            className="edit-button"
            onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <button type="submit" className="submit-button">
            Update Profile
          </button>
        )}
      </form>
    </div>
  )
}

export default UserProfile
