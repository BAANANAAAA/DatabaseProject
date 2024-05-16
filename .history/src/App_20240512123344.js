import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import MainFrame from './components/MainFrame'
import UserProfile from './components/UserProfile'
import ViewMessage from './components/ViewMessage'
import ProcessApplication from './components/ProcessApplication'
import SearchPage from './components/SearchPage'

import avatar from './figs/avatar.PNG'

function App () {
  const username = "JaneDoe" // Placeholder username

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
        </Routes>
      </div>
    </Router>
  )
}

export default App