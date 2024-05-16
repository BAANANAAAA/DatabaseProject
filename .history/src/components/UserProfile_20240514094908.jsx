import React, { useState } from 'react'
import './UserProfile.css'

function UserProfile({ onProfileUpdate }) {
  const [avatar, setAvatar] = useState(null)
  const [description, setDescription] = useState('')

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0])
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('description', description)

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        onProfileUpdate(data)
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
      <h2>Edit Your Profile</h2>
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
    </div>
  )
}

export default UserProfile
