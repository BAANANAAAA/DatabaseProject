import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated, userId }) {
  const [showForm, setShowForm] = useState(false)
  const [tType, setTType] = useState('')
  const [tCreatorID, setTCreatorID] = useState('')
  const [tCreateTime, setTCreateTime] = useState('')
  const [tReceiverID, setTReceiverID] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [friends, setFriends] = useState([])

  useEffect(() => {
    if (tType === 'SingleFriend') {
      fetchFriends()
    } else {
      setFriends([])
    }
  }, [tType])

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
        setFriends(data.data)
        console.log(`friend data in new thread: `, data)
      } else {
        throw new Error(data.message || 'Failed to fetch friends')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID: userId,
      tCreateTime,
      tReceiverID,
      toBlockID,
      toHoodID,
      targetName,
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
        onThreadCreated()
        alert('Thread created successfully')
        resetForm()
      } else {
        throw new Error('Failed to create thread')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setTType('')
    setTargetName('')
    setThreadContent('')
    setFriends([])
  }

  return (
    <div className="NewThread">
      <button className="PostButton" onClick={() => setShowForm(!showForm)}>
        {showForm ? '-' : '+'}
      </button>

      {showForm && (
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

          <button className="button">Create Thread</button>
        </form>
      )}
    </div>
  )
}

export default NewThread
