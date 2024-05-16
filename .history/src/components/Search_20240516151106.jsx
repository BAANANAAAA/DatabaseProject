import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

function Search({ userId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  const handleSearch = async () => {
    try {
      const response = await fetch(
        'https://your-api-endpoint.com/searchKeywordMessage',
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
        setMessages(data.data) // Set the messages in state if the response is successful
      } else {
        console.error('Search failed:', data.message)
        setMessages([]) // Clear messages if search failed
      }
    } catch (error) {
      console.error('Error searching:', error)
      setMessages([]) // Clear messages on error
    }
  }

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
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
  )
}

export default Search
