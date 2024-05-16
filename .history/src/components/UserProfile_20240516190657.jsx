import React, { useState, useEffect } from 'react'
import './UserProfile.css'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconUrl from '../figs/marker.png'

const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12.5, 41],
  popupAnchor: [1, -34],
})

function LocationPicker({ isEditing, onLocationSelect, onAddressSelect }) {
  const [position, setPosition] = useState(null)

  function LocationMarker() {
    const map = useMapEvents(
      isEditing
        ? {
            click: async (e) => {
              const latlng = e.latlng
              setPosition(latlng)
              onLocationSelect(latlng)
              fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
                {
                  headers: {
                    'Accept-Language': 'en',
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  if (data.address) {
                    const address = `${data.address.road || ''}, ${
                      data.address.city || ''
                    }, ${data.address.country || ''}`
                    onAddressSelect(address)
                  }
                })
            },
          }
        : {}
    )

    return position === null ? null : (
      <Marker position={position} icon={customIcon} />
    )
  }

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={13}
      style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}

function UserProfile({ onProfileUpdate, userId }) {
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState(null)
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          'http://192.168.1.27:3000/api/getprofile',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userId }),
          }
        )
        const { success, message, data } = await response.json()
        if (success) {
          const profile = data[0]
          setUsername(profile.name || '')
          setAddress(profile.userAddress || '')
          setDescription(profile.userProfile || '')
          setAvatar(profile.userPhoto || '')
          setPassword(profile.password || '')
        } else {
          throw new Error(message || 'Failed to fetch profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [userId])

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
    const formData = {
      userID: userId,
      name: username,
      password: password,
      userAddress: address,
      homeLocation: null,
      userProfile: description,
      userPhoto: avatar,
    }

    try {
      const response = await fetch(
        'http://192.168.1.27:3000/api/updateprofile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

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
      <div className="form-group">
        <label htmlFor="avatar">Avatar:</label>
        <img src={avatar} alt="user avatar" className="user-avatar" />
        <input
          type="text"
          id="avatar"
          name="avatar"
          value={avatar}
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
          disabled={!isEditing}
        />
      </div>
      <LocationPicker
        isEditing={isEditing}
        onLocationSelect={setLocation}
        onAddressSelect={setAddress}
      />
      {!isEditing ? (
        <button
          type="button"
          className="edit-button"
          onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      ) : (
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Update Profile
        </button>
      )}
    </div>
  )
}

export default UserProfile
