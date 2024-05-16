import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchResults } from '../SearchContext'
import './Search.css'

function Search({ userId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const { setResults } = useSearchResults()
  const navigate = useNavigate()

  const handleSearch = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.27:3000/api/searchKeywordMessage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID: userId, keyword: searchTerm }),
        }
      )

      const data = await response.json()
      if (data.success && data.data) {
        setResults(data.data) // Set the messages in global context
        navigate('/results') // Navigate to the results page
      } else {
        console.error('Search failed:', data.message)
        setResults([])
      }
    } catch (error) {
      console.error('Error searching:', error)
      setResults([])
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
