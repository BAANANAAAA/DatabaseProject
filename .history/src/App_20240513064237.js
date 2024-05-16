import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import MainFrame from './components/MainFrame'
import UserProfile from './components/UserProfile'
import ViewMessage from './components/ViewMessage'
import ProcessApplication from './components/ProcessApplication'
import SearchPage from './components/SearchPage'
import Search from './components/Search'
import Login from './components/Login'
import Apply from './components/Apply'

import avatar from './figs/avatar.PNG'

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loginHandler = (username, password) => {
    console.log(`Logged in with username: ${username} and password: ${password}`)
    setIsLoggedIn(true)
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
                <Link to="/apply">Apply</Link> |
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
              <Route path="/add-friend" element={<ViewMessage />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/incoming-application" element={<ProcessApplication />} />
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
