import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Login.css'

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null)

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng)
        onLocationSelect(e.latlng)
      },
    })

    return position === null ? null : <Marker position={position}></Marker>
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

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [intro, setIntro] = useState('')
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 })
  const [registerMode, setRegisterMode] = useState(false)

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    onLogin(username, password)
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('username', username)
    formData.append('password', password)
    formData.append('intro', intro)
    formData.append('avatar', avatar)
    // Assume 'location' should be serialized or split into appropriate format
    formData.append('location', JSON.stringify(location))
    onRegister(formData)
  }

  const toggleRegister = () => {
    setRegisterMode(!registerMode)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button onClick={toggleRegister} className="register-toggle">
          {registerMode ? 'Cancel' : 'Register'}
        </button>
        {registerMode && (
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar">Avatar:</label>
              <input
                id="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  style={{ width: '100px', height: '100px' }}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="intro">Personal Intro:</label>
              <textarea
                id="intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Describe yourself"
              />
            </div>
            <LocationPicker onLocationSelect={setLocation} />
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
