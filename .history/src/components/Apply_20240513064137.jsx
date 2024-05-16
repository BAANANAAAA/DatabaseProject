import React, { useState } from 'react'

function Apply({ onSubmit }) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('friend')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name, relationship })
    //TODO: sumit logic
  }

  return (
    <div className="add-friend-container">
      <h2>Add a New Connection</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="relationship">Relationship:</label>
          <select
            id="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}>
            <option value="friend">Friend</option>
            <option value="neighbour">Neighbour</option>
            <option value="block">Join Block</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Add Connection
        </button>
      </form>
    </div>
  )
}

export default Apply
