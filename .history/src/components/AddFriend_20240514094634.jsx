import React, { useState } from 'react'
import './Apply.css'

function AddFriend() {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('friend')

  const handleRelationshipSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/addFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, relationship }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Connection added successfully')
        // 处理成功的逻辑，例如重置表单
        setName('')
        setRelationship('friend')
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
