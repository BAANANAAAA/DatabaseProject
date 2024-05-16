import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import MainFrame from './components/MainFrame'
import UserProfile from './components/UserProfile'
import ViewMessage from './components/ViewMessage'
import SearchPage from './components/SearchPage'
import Search from './components/Search'
import Login from './components/Login'
import Apply from './components/Apply'
import AddFriend from './components/AddFriend'
import NewThread from './components/NewThread'

import avatar from './figs/avatar.PNG'

function getNewYorkTimeISO () {
  const options = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
  const parts = dateTimeFormat.formatToParts(new Date())
  const { year, month, day, hour, minute, second } = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
}

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showNewThreadForm, setShowNewThreadForm] = useState(false)
  const [user, setUser] = useState({ userId: null, username: null })

  const handleLoginSuccess = (userData) => {
    setUser({ userId: userData.userId, username: userData.username })
  }

  const loginHandler = (username, password) => {
    console.log(`Logged in with username: ${user.username}`)
    setIsLoggedIn(true)
  }

  const handleRegister = (userData) => {
    console.log('Registered:', userData)
  }

  const handleLogout = () => {
    const requestData = {
      userId: user.userId,
      lastLogin: getNewYorkTimeISO()
    }

    setUser({ userId: null, username: null })
    setIsLoggedIn(false)
    fetch('http://192.168.1.27:3000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Logout successful:', data)
        setUser({ userId: null, username: null })
        setIsLoggedIn(false)
      })
      .catch(error => {
        console.error('Logout failed:', error)
      })
  }

  const handleThreadCreated = () => {
    console.log('Thread created')
    setShowNewThreadForm(false)
  }

  return (
    <Router>
      <div className="App">

        {isLoggedIn ? (
          <>
            <header className="app-header">
              <nav>
                <Link to="/"> Home</Link> |
                <Link to="/user-profile"> User Profile</Link> |
                <Link to="/new-thread"> New Thread</Link> |
                <Link to="/add-friend"> Add Friend</Link> |
                <Link to="/apply"> Apply</Link> |
                <Link to="/incoming-application"> Incoming Application</Link> |
              </nav>
              <Search />
              <div className="user-info">
                <Link to="/user-profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  <img src={avatar} alt="user avatar" className="user-avatar" />
                  <span className="username">{user.username}</span>
                </Link>
              </div>
              <button onClick={handleLogout} style={{ padding: '8px', marginLeft: '-450px' }}>Logout</button>
            </header>

            <button className="post-button" onClick={() => setShowNewThreadForm(!showNewThreadForm)}>
              {showNewThreadForm ? '-' : '+'}
            </button>

            <Routes>
              <Route path="/" element={<MainFrame />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/new-thread" element={<NewThread onThreadCreated={handleThreadCreated} userId={user.userId} showForm={showNewThreadForm} setShowForm={setShowNewThreadForm} />} />
              <Route path="/add-friend" element={<AddFriend userId={user.userId} />} />
              <Route path="/apply" element={<Apply userId={user.userId} />} />
              <Route path="/incoming-application" element={<ViewMessage userId={user.userId} />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={loginHandler} onRegister={handleRegister} onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App
