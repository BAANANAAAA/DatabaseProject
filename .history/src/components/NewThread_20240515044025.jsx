import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated }) {
  const [tType, setTType] = useState('')
  const [tCreatorID, setTCreatorID] = useState('')
  const [tCreateTime, setTCreateTime] = useState('')
  const [tReceiverID, setTReceiverID] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [friends, setFriends] = useState([]) // State to hold friends

  useEffect(() => {
    if (tType === 'SingleFriend') {
      fetchFriends() // Fetch friends when the type is SingleFriend
    }
  }, [tType])

  const fetchFriends = async () => {
    const response = await fetch('/api/getfriend')
    const data = await response.json()
    if (response.ok) {
      setFriends(data.friends) // Assuming the response contains an array of friends under 'friends'
    } else {
      alert('Failed to fetch friends')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID,
      tCreateTime,
      tReceiverID,
      toBlockID,
      toHoodID,
      targetName,
      content: threadContent,
    }

    const response = await fetch('/api/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thread),
    })

    if (response.ok) {
      onThreadCreated()
      alert('Thread created successfully')
      resetForm()
    } else {
      alert('Failed to create thread')
    }
  }

  const resetForm = () => {
    setTType('')
    setTargetName('')
    setThreadContent('')
    setFriends([]) // Reset friends list
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

        {tType === 'SingleFriend' && (
          <select
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            disabled={friends.length === 0}>
            <option value="">Select Friend</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          placeholder="Enter thread content..."
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
          rows="4"></textarea>

        <button type="submit">Create Thread</button>
      </form>
    </div>
  )
}

export default NewThread
