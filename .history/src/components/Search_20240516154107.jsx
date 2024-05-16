import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

function Search({ userId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationTerm, setLocationTerm] = useState('')
  const [messages, setMessages] = useState([])
  const [locationMessages, setLocationMessages] = useState([])
  const navigate = useNavigate()

  const handleSearch = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.27:3000/api/searchkeywordmessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userId,
            keyword: searchTerm,
          }),
        }
      )

      const data = await response.json()
      if (data.success && data.data) {
        setMessages(data.data)
      } else {
        console.error('Search failed:', data.message)
        setMessages([])
      }
    } catch (error) {
      console.error('Error searching:', error)
      setMessages([])
    }
  }

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.27:3000/api/searchlocationmessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userId,
            location: locationTerm,
          }),
        }
      )

      const data = await response.json()
      if (data.success && data.data) {
        setLocationMessages(data.data)
      } else {
        console.error('Location search failed:', data.message)
        setLocationMessages([])
      }
    } catch (error) {
      console.error('Error searching location:', error)
      setLocationMessages([])
    }
  }

  return (
    <div className="search-container" style={{ display: 'flex' }}>
      <div className="search-section" style={{ width: '50%' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="search-results">
          {messages.map((message) => (
            <div key={message.messageID} className="message">
              <h4>{message.mTitle}</h4>
              <p>{message.textBody}</p>
              <p>
                Created by: {message.mCreatorName} on{' '}
                {new Date(message.mCreateTime).toLocaleDateString()}
              </p>
              <img
                src={message.mPhoto}
                alt="Profile"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="search-section" style={{ width: '50%' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by location..."
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
          />
          <button onClick={handleLocationSearch}>Search</button>
        </div>
        <div className="search-results">
          {locationMessages.map((message) => (
            <div key={message.messageID} className="message">
              <h4>{message.mTitle}</h4>
              <p>{message.textBody}</p>
              <p>
                Created by: {message.mCreatorName} on{' '}
                {new Date(message.mCreateTime).toLocaleDateString()}
              </p>
              {message.mLocation && (
                <p>
                  Location: x={message.mLocation.x}, y={message.mLocation.y}
                </p>
              )}
              <img
                src={message.mPhoto}
                alt="Profile"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search
