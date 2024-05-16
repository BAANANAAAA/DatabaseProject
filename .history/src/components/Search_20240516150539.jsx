import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

function Search({ userId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.27:3000/api/searchKeywordMessage',
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
      console.log(`search data:`, data)

      navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
    } catch (error) {
      alert(error)
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
