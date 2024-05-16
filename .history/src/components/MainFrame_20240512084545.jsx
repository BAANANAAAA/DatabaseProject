import React, { useState } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [searchTerm, setSearchTerm] = useState('')
  const users = [
    { name: 'Alice', time: '19:00:00', location: 'Hood', message: 'xxx' },
    { name: 'Bob', time: '19:00:00', location: 'Hood', message: 'xxx' },
  ]

  const handleSearch = () => {
    console.log('Search term: ', searchTerm) // Placeholder for search functionality
  }

  return (
    <div className="App">
      <header>
        <div className="left-placeholder"></div>
        <div className="search-section">
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="user-info">
          <div className="notifications">You have new messages</div>
          <img
            src="blank-profile-picture.png"
            alt="Profile"
            onClick={() => alert('Redirect to user profile')}
          />
          <div
            className="username"
            onClick={() => alert('Redirect to user profile')}>
            username
          </div>
        </div>
      </header>
      <div className="sidebar">
        <div>neighbor</div>
        <div>friend</div>
        <div>block</div>
        <div>hood</div>
      </div>
      <div className="content">
        {users.map((user, index) => (
          <div key={index} className="post">
            <div className="post-info">
              <input type="radio" name="user" id={`user${index}`} />
              <label htmlFor={`user${index}`}>
                {user.name} - {user.time} {user.location}
              </label>
            </div>
            <div className="post-message">{user.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
