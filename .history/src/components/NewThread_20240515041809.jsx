import React, { useState } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated }) {
  const [tType, setTType] = useState('')
  const [tCreatorID, setTCreatorID] = useState('')
  const [tCreateTime, setTCreateTime] = useState('')
  const [tReceiverID, setTReceiverID] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID,
      tCreateTime,
      tReceiverID,
      toBlockID,
      toHoodID,
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
    } else {
      alert('Failed to create thread')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Thread Type"
        value={tType}
        onChange={(e) => setTType(e.target.value)}
      />
      <input
        type="text"
        placeholder="Creator ID"
        value={tCreatorID}
        onChange={(e) => setTCreatorID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Create Time"
        value={tCreateTime}
        onChange={(e) => setTCreateTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Receiver ID"
        value={tReceiverID}
        onChange={(e) => setTReceiverID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Block ID"
        value={toBlockID}
        onChange={(e) => setToBlockID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Hood ID"
        value={toHoodID}
        onChange={(e) => setToHoodID(e.target.value)}
      />
      <button type="submit">Create Thread</button>
    </form>
  )
}

export default NewThread
