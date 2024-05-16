import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated, userId, setShowForm }) {
  const [tType, setTType] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [friends, setFriends] = useState([])

  useEffect(() => {
    if (tType === 'SingleFriend') {
      fetchFriends()
    }
  }, [tType, userId])

  const fetchFriends = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3000/api/getfriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId }),
      })
      const data = await response.json()
      if (response.ok) {
        console.log(data)
        setFriends(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch friends')
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
      alert(error.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID: userId,
      tReceiverID: targetName,
      content: threadContent,
    }

    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thread),
      })

      if (response.ok) {
        onThreadCreated() // Notify App that the thread has been created
        setShowForm(false) // Close modal
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create thread')
      }
    } catch (error) {
      console.error('Error creating thread:', error)
      alert(error.message)
    }
  }

  return (
    <div className="NewThread">
      <form onSubmit={handleSubmit}>
        <select value={tType} onChange={(e) => setTType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="All">All</option>
          <option value="SingleFriend">Single Friend</option>
          <option value="SingleNeighbor">Single Neighbor</option>
          <option value="Friends">Friends</option>
          <option value="Neighbors">Neighbors</option>
          <option value="Block">Block</option>
          <option value="Hood">Hood</option>
        </select>

        {tType === 'SingleFriend' && friends.length > 0 && (
          <select
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}>
            <option value="">Select a Friend</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        )}

        {tType === 'SingleNeighbor' && (
          <input
            type="text"
            placeholder="Enter Neighbor's Name"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />
        )}

        <textarea
          placeholder="Enter thread content..."
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
          rows="4"></textarea>

        <button className="button" type="submit">
          Create Thread
        </button>
      </form>
    </div>
  )
}

export default NewThread
