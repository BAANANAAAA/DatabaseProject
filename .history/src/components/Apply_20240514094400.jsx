import React, { useState } from 'react'
import './Apply.css'

function Apply() {
  const [blockName, setBlockName] = useState('')

  const handleBlockJoinSubmit = (event) => {
    event.preventDefault()
    onBlockJoinSubmit(blockName)
  }

  return (
    <div className="application-container">
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
