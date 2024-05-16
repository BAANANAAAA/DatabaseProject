import React, { useState } from 'react'
import './Login.css'

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [registerMode, setRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [intro, setIntro] = useState('')

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    onLogin(username, password)
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()
    onRegister({ name, avatar, username, password, intro })
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
              <label htmlFor="avatar">Avatar URL:</label>
              <input
                id="avatar"
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Enter URL of your avatar"
              />
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
