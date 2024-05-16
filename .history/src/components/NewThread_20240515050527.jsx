import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated }) {
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
    } else if (tType === 'SingleNeighbor') {
      setFriends([])
    }
  }, [tType])

  const fetchFriends = async () => {
    const response = await fetch('/api/getfriend')
    const data = await response.json()
    if (response.ok) {
      setFriends(data.friends)
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
    setShowForm(false)
    setTType('')
    setTargetName('')
    setThreadContent('')
    setFriends([])
  }

  return (
    <div className="NewThread">
      <button className="PostButton" onClick={() => setShowForm(!showForm)}>
        +
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          {/* Form inputs and submit button */}
        </form>
      )}
    </div>
  )
}

export default NewThread
