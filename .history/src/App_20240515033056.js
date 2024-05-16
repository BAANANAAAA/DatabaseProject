import React, { useState } from 'react'
import './App.css'
import { useUser } from './UserContext'
import { useNavigate } from 'react-router-dom'
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

function UserInfo () {
  const { user, setUser } = useUser()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const logoutHandler = () => {
    setUser({ isLoggedIn: false })
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <div className="user-info">
      <Link to="/user-profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
        <img src={user.avatar || avatar} alt="user avatar" className="user-avatar" />
        <span className="username">{user.username || "JaneDoe"}</span>
      </Link>
      <button onClick={logoutHandler} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  )
}



function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { user, setUser } = useUser()

  const loginHandler = (username, password) => {
    const userData = {
      username: username,
      avatar: "/path/to/avatar.jpg",
      isLoggedIn: true
    }
    console.log(`Logged in with username: ${username} and password: ${password}`)
    setIsLoggedIn(true)
    setUser(userData)
  }


  // const loginHandler = (username, password) => {
  //   console.log(`Logged in with username: ${username} and password: ${password}`)
  //   setIsLoggedIn(true)
  // }

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
                <Link to="/incoming-application"> Incoming Application</Link>
              </nav>
              <Search />
              <UserInfo />
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
