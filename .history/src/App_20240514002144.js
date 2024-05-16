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

  const loginHandler = (username, password) => {
    console.log(`Logged in with username: ${username} and password: ${password}`)
    setIsLoggedIn(true)
  }

  const onRelationshipSubmit = async ({ name, relationship }) => {
    // TODO: do the real func
    try {
      const response = await fetch('/api/add-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          relationship: relationship
        })
      })
      const data = await response.json()
      if (response.ok) {
        console.log('Connection added:', data)
        alert('Connection successfully added!')
      } else {
        throw new Error(data.message || "Failed to add connection")
      }
    } catch (error) {
      console.error('Error adding connection:', error)
      alert('Error adding connection: ' + error.message)
    }
  }

  const onBlockJoinSubmit = async (blockName) => {
    // TODO: do the real func
    try {
      const response = await fetch('/api/join-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockName })
      })
      const data = await response.json()
      if (response.ok) {
        console.log('Join block request submitted:', data)
        alert('Join block request successfully submitted!')
      } else {
        throw new Error(data.message || "Failed to submit join block request")
      }
    } catch (error) {
      console.error('Error submitting join block request:', error)
      alert('Error submitting join block request: ' + error.message)
    }
  }

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <>
            <header className="app-header">
              <nav>
                <Link to="/">Home</Link> |
                <Link to="/user-profile">User Profile</Link> |
                <Link to="/add-friend">Add Friend</Link> |
                <Link to="/apply">Apply</Link>|
                <Link to="/incoming-application">Incoming Application</Link>
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
              <Route path="/add-friend" element={<AddFriend onRelationshipSubmit={onRelationshipSubmit} />} />
              <Route path="/apply" element={<Apply onBlockJoinSubmit={onBlockJoinSubmit} />} />
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
