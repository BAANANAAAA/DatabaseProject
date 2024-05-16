import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import MainFrame from './components/MainFrame'
import UserProfile from './components/UserProfile'
import ViewMessage from './components/ViewMessage'
import ProcessApplication from './components/ProcessApplication'

function App () {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <Link to="/">Home</Link> |
            <Link to="/user-profile">User Profile</Link> |
            <Link to="/add-friend">Add Friend</Link> |
            <Link to="/incoming-application">Add Friend</Link>
          </nav>
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
