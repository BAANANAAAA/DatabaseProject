import React, { createContext, useContext, useState } from 'react'

const SearchResultsContext = createContext()

export function useSearchResults () {
  return useContext(SearchResultsContext)
}

export const SearchResultsProvider = ({ children }) => {
  const [results, setResults] = useState([])

  return (
    <SearchResultsContext.Provider value={{ results, setResults }}>
      {children}
    </SearchResultsContext.Provider>
  )
}
