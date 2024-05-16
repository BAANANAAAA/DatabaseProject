import React, { useState } from 'react'
import './Apply.css'

function Apply(userId) {
  const [blockName, setBlockName] = useState('')

  const handleBlockJoinSubmit = async (event) => {
    event.preventDefault()
    const timestamp = new Date().toISOString()

    try {
      const response = await fetch('http://192.168.1.27:3000/api/addBlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          timestamp,
        }),
      })

      const data = await response.json()
      console.log('UserId in apply:', userId)
      if (response.ok && data.success) {
        alert(data.message)
        setBlockName('')
      } else {
        alert(`Error: ${data.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  }

  return (
    <div className="application-container">
      <div className="join-block-container">
        <h2>Join a Block</h2>
        <form onSubmit={handleBlockJoinSubmit}>
          {/* <div className="form-group">
            <label htmlFor="blockName">Block Name:</label>
            <input
              id="blockName"
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="Enter block name"
            />
          </div> */}
          <button type="submit" className="join-block-button">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default Apply
