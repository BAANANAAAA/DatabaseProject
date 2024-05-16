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

  // Function to fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.27:3000/api/getuserprofile/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const { success, message, data } = await response.json()
      if (success && data.length > 0) {
        const userData = data[0]
        setProfile({
          name: userData.name,
          userPhoto: userData.userPhoto,
          userProfile: userData.userProfile,
          userAddress: userData.userAddress,
          homeLocation: userData.homeLocation,
          showDetails: false,
        })
      } else {
        throw new Error(message || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Toggle the visibility of user details
  const toggleDetails = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      showDetails: !prevProfile.showDetails,
    }))
  }

  // Fetch user data on component mount
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
