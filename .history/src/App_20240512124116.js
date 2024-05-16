import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'
import MainFrame from './components/MainFrame'
import UserProfile from './components/UserProfile'
import ViewMessage from './components/ViewMessage'
import ProcessApplication from './components/ProcessApplication'
import SearchPage from './components/SearchPage'

import avatar from './figs/avatar.PNG'

function App () {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate() // Hook for navigation
  const username = "JaneDoe" // Placeholder username

  const handleSearch = () => {
    // Navigate to the SearchPage with searchTerm
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav>
            <Link to="/">Home</Link> |
            <Link to="/user-profile">User Profile</Link> |
            <Link to="/add-friend">Add Friend</Link> |
            <Link to="/incoming-application">Incoming Application</Link>
          </nav>
          {/* Search Bar in the center */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="user-info">
            <Link to="/user-profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <img src={avatar} alt="user avatar" className="user-avatar" />
              <span className="username">{username}</span>
            </Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<MainFrame />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/add-friend" element={<ViewMessage />} />
          <Route path="/incoming-application" element={<ProcessApplication />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
