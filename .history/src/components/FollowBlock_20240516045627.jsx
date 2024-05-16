import React, { useState } from 'react'

function FollowBlock({ userId }) {
  const [blockName, setBlockName] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://192.168.1.27:3000/api/followblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId, blockName: blockName }),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Block followed successfully!')
        setBlockName('')
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to follow block. Please try again later.')
    }
  }

  return (
    <div className="follow-block-container">
      <h2>Follow a Block</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={blockName}
          onChange={(e) => setBlockName(e.target.value)}
          placeholder="Enter block name"
          required
        />
        <button type="submit">Follow Block</button>
      </form>
    </div>
  )
}

export default FollowBlock
