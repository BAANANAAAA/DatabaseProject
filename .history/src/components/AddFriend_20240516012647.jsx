import React, { useState } from 'react'
import './AddFriend.css'

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

function AddFriend(props) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('friend')
  const { userId } = props
  const timestamp = getNewYorkTimeISO()

  const handleRelationshipSubmit = async (event) => {
    event.preventDefault()

    const apiUrl =
      relationship === 'friend'
        ? 'http://192.168.1.27:3000/api/addfriend'
        : 'http://192.168.1.27:3000/api/addneighbour'

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId, username: name, timestamp }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Connection added successfully')
        setName('')
        setRelationship('friend') // Consider if resetting is necessary
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  }

  return (
    <div className="application-container">
      <div className="add-friend-container">
        <h2>Add a New Connection</h2>
        <form onSubmit={handleRelationshipSubmit} className="form-style">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name"
              className="input-style"
            />
          </div>
          <div className="form-group">
            <label htmlFor="relationship">Relationship:</label>
            <select
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="select-style">
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
