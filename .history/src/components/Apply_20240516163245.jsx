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
  const { userId } = props
  console.log('UserId in apply:', userId)

  const handleBlockJoinSubmit = async (event) => {
    event.preventDefault()
    const timestamp = getNewYorkTimeISO()

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
      } else {
        alert(`Error: ${data.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  }

  const handleExitBlock = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3000/api/exitblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId }),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Exited blocks successfully!')
      } else {
        alert(`Error exiting blocks: ${data.message}`)
      }
    } catch (error) {
      console.error('Error exiting blocks:', error)
      alert('Failed to exit blocks. Please try again later.')
    }
  }

  return (
    <div className="application-container">
      <div className="join-block-container">
        <h2>Join a Block</h2>
        <form onSubmit={handleBlockJoinSubmit}>
          <button type="submit" className="join-block-button">
            Submit Request
          </button>
        </form>
        <button type="button" onClick={handleExitBlock} className="exit-button">
          Exit Current Block
        </button>
      </div>
    </div>
  )
}

export default Apply
