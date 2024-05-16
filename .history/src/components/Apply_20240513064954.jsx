import React, { useState } from 'react'
import './Apply.css'

function Apply({ onRelationshipSubmit, onBlockJoinSubmit }) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('friend')
  const [blockName, setBlockName] = useState('')

  const handleRelationshipSubmit = (event) => {
    event.preventDefault()
    onRelationshipSubmit({ name, relationship })
  }

  const handleBlockJoinSubmit = (event) => {
    event.preventDefault()
    onBlockJoinSubmit(blockName)
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

      <div className="join-block-container">
        <h2>Join a Block</h2>
        <form onSubmit={handleBlockJoinSubmit}>
          <div className="form-group">
            <label htmlFor="blockName">Block Name:</label>
            <input
              id="blockName"
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="Enter block name"
            />
          </div>
          <button type="submit" className="join-block-button">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default Apply
