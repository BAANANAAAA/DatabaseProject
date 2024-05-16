import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

function Search({ userID }) {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = async () => {
    try {
      // Using fetch API to make the POST request
      const response = await fetch(
        'https://your-api-endpoint.com/searchKeywordMessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userID,
            keyword: searchTerm,
          }),
        }
      )

      // Assume the response needs to be JSON parsed
      const data = await response.json()

      // Navigate based on the response
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
    } catch (error) {
      console.error('Error searching:', error)
      // Handle error appropriately, maybe set an error state and show in UI
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default Search
