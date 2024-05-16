import React from 'react'
import { useSearchResults } from '../searchContext'

function SearchResults() {
  const { results } = useSearchResults()

  return (
    <div className="search-results">
      {results.map((message) => (
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
  )
}

export default SearchResults
