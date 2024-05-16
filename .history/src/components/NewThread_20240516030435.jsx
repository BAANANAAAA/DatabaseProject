import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated, userId, showForm, setShowForm }) {
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
        setShowForm(false) // Close form on success
        resetForm()
      } else {
        throw new Error('Failed to create thread')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const resetForm = () => {
    setTType('')
    setTargetName('')
    setThreadContent('')
    setFriends([])
  }

  if (!showForm) return null

  return (
    <div className="NewThread">
      <form onSubmit={handleSubmit}>
        <select value={tType} onChange={(e) => setTType(e.target.value)}>
          <option value="">Select Type</option>
          {/* Options */}
        </select>
        {/* Additional form fields */}
        <button className="button">Create Thread</button>
      </form>
    </div>
  )
}

export default NewThread
