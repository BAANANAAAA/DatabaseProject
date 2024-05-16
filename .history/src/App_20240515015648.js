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

import avatar from './figs/avatar.PNG'

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loginHandler = async (username, password) => {
    console.log(`Attempting to log in with username: ${username} and password: ${password}`)
    try {
      const response = await fetch('http://192.168.1.27', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        console.log('Login successful:', data.message)
        setIsLoggedIn(true)
      } else {
        console.error('Login failed:', data.message)
        alert(data.message)
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Login request failed. Please try again.')
    }
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
                <Link to="/add-friend"> Add Friend</Link> |
                <Link to="/apply"> Apply</Link> |
                <Link to="/incoming-application"> Incoming Applications</Link>
              </nav>
              <Search />
              <div className="user-info">
                <Link to="/user-profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  <img src={avatar} alt="user avatar" className="user-avatar" />
                  <span className="username">JaneDoe</span>
                </Link>
              </div>
            </header>
            <Routes>
              <Route path="/" element={<MainFrame />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/add-friend" element={<AddFriend />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/incoming-application" element={<ViewMessage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={loginHandler} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App
