import React from 'react'
import { useLocation } from 'react-router-dom'

function SearchPage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const query = queryParams.get('query')

  return (
    <div>
      <h1>Search Results</h1>
      <p>Searching for: {query}</p>
      {/* Implement the logic to display search results */}
    </div>
  )
}

export default SearchPage
