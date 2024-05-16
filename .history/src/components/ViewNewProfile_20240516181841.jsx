import React, { useState, useEffect } from 'react'
import './ViewNewProfile.css'

function ViewNewProfile({ userIds }) {
  const [profiles, setProfiles] = useState([])

  const fetchUserData = async () => {
    try {
      for (const userId of userIds) {
        const response = await fetch(
          `http://192.168.1.27:3000/api/getuserprofile`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userId }),
          }
        )
        const { success, message, data } = await response.json()
        console.log(data)
        if (success && data.length > 0) {
          setProfiles((prevProfiles) => [
            ...prevProfiles,
            {
              ...data[0],
              showDetails: false,
            },
          ])
        } else {
          throw new Error(message || 'Failed to fetch data')
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const toggleDetails = (index) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile, i) => {
        if (i === index) {
          return { ...profile, showDetails: !profile.showDetails }
        }
        return profile
      })
    )
  }

  useEffect(() => {
    fetchUserData()
  }, [userIds])

  return (
    <div className="profile-container">
      <h1>View User Profiles</h1>
      {profiles.map((profile, index) => (
        <div key={index} className="profile-item">
          <div className="profile-header">
            <img
              src={profile.userPhoto || 'default_avatar.png'}
              alt="User Avatar"
              className="profile-avatar"
            />
            <button
              onClick={() => toggleDetails(index)}
              className="username-btn">
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
      ))}
    </div>
  )
}

export default ViewNewProfile
