import React, { useState } from 'react'
import './Apply.css'

function AddFriend({ onRelationshipSubmit, onBlockJoinSubmit }) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('friend')

  const handleRelationshipSubmit = (event) => {
    event.preventDefault()
    onRelationshipSubmit({ name, relationship })
  }

  return (
    <div className="application-container">
      <div className="add-friend-container">
        <h2>Add a New Connection</h2>
        <form onSubmit={handleRelationshipSubmit}>
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
            </select>
          </div>
          <button type="submit" className="submit-button">
            Add Connection
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddFriend
