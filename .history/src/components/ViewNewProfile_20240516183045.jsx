import React, { useState, useEffect } from 'react'
import './ViewNewProfile.css'

function ViewNewProfile({ userId }) {
  const [profile, setProfile] = useState({
    name: '',
    userPhoto: '',
    userProfile: '',
    userAddress: '',
    homeLocation: { lng: '', lat: '' },
    showDetails: false,
  })

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.27:3000/api/getnewmemberprofile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userId }),
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const { success, message, data } = await response.json()

      // 打印整个响应以确保结构正确
      console.log('API response:', data)

      if (success && data.length > 0) {
        const userData = data[0]

        // 在尝试访问属性之前检查userData是否为一个对象
        if (userData && typeof userData === 'object') {
          setProfile({
            name: userData.name || '',
            userPhoto: userData.userPhoto || 'default_avatar.png',
            userProfile: userData.userProfile || 'No profile',
            userAddress: userData.userAddress || 'No address',
            homeLocation: userData.homeLocation || {
              lng: 'Not available',
              lat: 'Not available',
            },
            showDetails: false,
          })
        } else {
          throw new Error('Invalid user data structure')
        }
      } else {
        throw new Error(message || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const toggleDetails = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      showDetails: !prevProfile.showDetails,
    }))
  }

  useEffect(() => {
    fetchUserData()
  }, [userId])

  return (
    <div className="profile-container">
      <h1>View New Profile</h1>
      <div className="profile-header">
        <img
          src={profile.userPhoto || 'default_avatar.png'}
          alt="User Avatar"
          className="profile-avatar"
        />
        <button onClick={toggleDetails} className="username-btn">
          {profile.name}
        </button>
      </div>
      {profile.showDetails && (
        <div className="profile-details">
          <p>{profile.userProfile}</p>
          <p>Address: {profile.userAddress}</p>
          <p>
            Home Coordinates: Latitude {profile.homeLocation.lat}, Longitude{' '}
            {profile.homeLocation.lng}
          </p>
        </div>
      )}
    </div>
  )
}

export default ViewNewProfile
