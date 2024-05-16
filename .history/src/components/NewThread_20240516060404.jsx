import React, { useState, useEffect } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated, userId, setShowForm }) {
  const [tType, setTType] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [mTitle, setMTitle] = useState('')
  const [mLocation, setMLocation] = useState('')
  const [friends, setFriends] = useState([])
  const [neighbors, setNeighbors] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')

  useEffect(() => {
    if (tType === 'SingleFriend') {
      fetchFriends()
    } else if (tType === 'SingleNeighbor') {
      fetchNeighbors()
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
          setTargetName(data.data[0].friendID.toString())
          setSelectedName(data.data[0].friendName)
        }
      } else {
        throw new Error(data.message || 'Failed to fetch friends')
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
      alert(error.message)
    }
  }

  const fetchNeighbors = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3000/api/getneighbor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId }),
      })
      const data = await response.json()
      if (response.ok) {
        setNeighbors(data.data)
        if (data.data.length > 0) {
          setTargetName(data.data[0].neighborID.toString())
          setSelectedName(data.data[0].neighborName)
        }
      } else {
        throw new Error(data.message || 'Failed to fetch neighbors')
      }
    } catch (error) {
      console.error('Error fetching neighbors:', error)
      alert(error.message)
    }
  }

  const handleSelectChange = (event) => {
    const selectedID = event.target.value
    setTargetName(selectedID)
    const selected = (tType === 'SingleFriend' ? friends : neighbors).find(
      (item) => item.id.toString() === selectedID
    )
    if (selected) {
      setSelectedName(selected.name)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID: userId,
      tCreateTime: new Date().toISOString(),
      tReceiverID: targetName,
      toBlockID,
      toHoodID,
      mTitle,
      mLocation,
      textBody: threadContent,
    }

    try {
      const response = await fetch('http://192.168.1.27:3000/api/addthread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thread),
      })

      if (response.ok) {
        onThreadCreated()
        setShowForm(false)
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
          <div>
            <select value={targetName} onChange={handleSelectChange}>
              {friends.map((friend) => (
                <option key={friend.friendID} value={friend.friendID}>
                  {friend.friendName}
                </option>
              ))}
            </select>
            <div>Selected: {selectedName}</div>
          </div>
        )}

        {tType === 'SingleNeighbor' && neighbors.length > 0 && (
          <div>
            <select value={targetName} onChange={handleSelectChange}>
              {neighbors.map((neighbor) => (
                <option key={neighbor.neighborID} value={neighbor.neighborID}>
                  {neighbor.neighborName}
                </option>
              ))}
            </select>
            <div>Selected: {selectedName}</div>
          </div>
        )}

        <input
          type="text"
          placeholder="Enter title..."
          value={mTitle}
          onChange={(e) => setMTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter location..."
          value={mLocation}
          onChange={(e) => setMLocation(e.target.value)}
        />

        <textarea
          placeholder="Enter thread content..."
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
          rows="4"></textarea>

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
