import React, { useState, useEffect } from 'react'
import './UserProfile.css'

function UserProfile({ onProfileUpdate }) {
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // 假设从API获取当前用户资料
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/get-profile')
        const data = await response.json()
        if (response.ok) {
          setUsername(data.username)
          setAddress(data.address)
          setDescription(data.description)
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('username', username)
    formData.append('address', address)
    formData.append('description', description)

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
      {!isEditing ? (
        <div>
          <img
            src={avatar || 'default-avatar.png'}
            alt="Avatar"
            className="profile-avatar"
          />
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="avatar">Avatar:</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe yourself here..."></textarea>
          </div>
          <button type="submit" className="submit-button">
            Update Profile
          </button>
        </form>
      )}
    </div>
  )
}

export default UserProfile
