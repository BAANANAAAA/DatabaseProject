import React, { useState } from 'react'
import './Apply.css'

function getNewYorkTimeISO() {
  const options = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
  const parts = dateTimeFormat.formatToParts(new Date())
  const { year, month, day, hour, minute, second } = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
}

function Apply(props) {
  const [blockName, setBlockName] = useState('')
  const { userId } = props
  console.log('UserId in apply:', userId)

  const handleBlockJoinSubmit = async (event) => {
    event.preventDefault()
    const timestamp = new Date()
      .toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })
      .toISOString()

    try {
      const response = await fetch('http://192.168.1.27:3000/api/addblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          timestamp,
        }),
      })

      const data = await response.json()

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
