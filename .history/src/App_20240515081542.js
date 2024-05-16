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
  const [user, setUser] = useState({ userId: null, username: null })

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const loginHandler = (username, password) => {
    console.log(`Logged in with username: ${user.username}`)
    setIsLoggedIn(true)
  }

  const handleRegister = (userData) => {
    console.log('Registered:', userData)
  }

  const handleLogout = () => {
    setUser({ userId: null, username: null })
    setIsLoggedIn(false)
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
                <Link to="/add-friend"> Add </Link> |
                <Link to="/apply"> Apply</Link> |
                <Link to="/incoming-application"> Incoming Application</Link> |
              </nav>
              <Search />
              <div className="user-info">
                <Link to="/user-profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                  <img src={avatar} alt="user avatar" className="user-avatar" />
                  <span className="username">{user.userId}</span>
                </Link>
              </div>
              <button onClick={handleLogout} style={{ padding: '8px', marginLeft: '-450px' }}>Logout</button>
            </header>

            <Routes>
              <Route path="/" element={<MainFrame />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/add-friend" element={<AddFriend />} />
              <Route path="/apply" element={<Apply userId={user.userId} />} />
              <Route path="/incoming-application" element={<ViewMessage />} />
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
