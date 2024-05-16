import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
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
