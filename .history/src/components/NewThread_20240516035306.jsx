import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated, userId, setShowForm }) {
  const [tType, setTType] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [friends, setFriends] = useState([])
  const [selectedFriendName, setSelectedFriendName] = useState('') // State to store the selected friend's name

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
        setFriends(data.data)
        if (data.data.length > 0) {
          setTargetName(data.data[0].friendID.toString()) // Set default to first friend's ID
          setSelectedFriendName(data.data[0].friendName) // Set default to first friend's name
        }
      } else {
        throw new Error(data.message || 'Failed to fetch friends')
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
      alert(error.message)
    }
  }

  const handleSelectChange = (event) => {
    const friendID = event.target.value
    setTargetName(friendID)
    const friend = friends.find(
      (friend) => friend.friendID.toString() === friendID
    )
    if (friend) {
      setSelectedFriendName(friend.friendName)
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
        onThreadCreated()
        setShowForm(false) // Close modal on successful thread creation
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
        {/* Form select inputs and textareas */}
        <button className="button" type="submit">
          Create Thread
        </button>
        <button
          type="button"
          className="button close-button"
          onClick={() => setShowForm(false)}>
          Close
        </button>
      </form>
    </div>
  )
}

export default NewThread
