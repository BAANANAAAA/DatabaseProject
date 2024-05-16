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

      console.log('API response:', data)

      if (success) {
        if (data && data.length > 0) {
          const userData = data[0]

          if (userData && typeof userData === 'object') {
            setProfile({
              name: userData.name || '',
              userPhoto: userData.userPhoto || 'default_avatar.png',
              userProfile: userData.userProfile || 'No profile available',
              userAddress: userData.userAddress || 'No address available',
              homeLocation: userData.homeLocation || {
                lng: 'Not available',
                lat: 'Not available',
              },
              showDetails: false,
            })
          }
        } else {
          setProfile({
            name: 'No Name',
            userPhoto: 'default_avatar.png',
            userProfile: 'No profile available',
            userAddress: 'No address available',
            homeLocation: { lng: 'Not available', lat: 'Not available' },
            showDetails: false,
          })
          console.warn('No data received from the backend')
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

  const avatarURL =
    'https://images.unsplash.com/photo-1715423058726-ddea1ec51b66?q=80&w=1947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  return (
    <div className="profile-container">
      <h1>View New Profile</h1>
      <div className="profile-header" onClick={toggleDetails}>
        <img
          src={profile.userPhoto || avatarURL}
          alt="User Avatar"
          className="profile-avatar"
        />
        <div>{profile.name}</div>
      </div>
      {profile.showDetails && (
        <div className="profile-details">
          <p>Description: {profile.userProfile}</p>
          <p>Address: {profile.userAddress}</p>
        </div>
      )}
    </div>
  )
}

export default ViewNewProfile
