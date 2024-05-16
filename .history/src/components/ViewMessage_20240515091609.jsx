import React, { useState, useEffect } from 'react'
import './ViewMessage.css'

function ViewMessage({ props }) {
  const { userId } = props
  const [friendRequests, setFriendRequests] = useState([])
  const [blockRequests, setBlockRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const friendResponse = await fetch(
        'http://192.168.1.27:3000/api/getfriendapplication'
      )
      const blockResponse = await fetch(
        'http://192.168.1.27:3000/api/getblockapplication'
      )
      const friendData = await friendResponse.json()
      const blockData = await blockResponse.json()
      if (friendResponse.ok && blockResponse.ok) {
        setFriendRequests(friendData.requests)
        setBlockRequests(blockData.requests)
      } else {
        throw new Error('Failed to fetch requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      alert('Error fetching requests: ' + error.message)
    }
  }

  const handleResponse = async (requestId, accepted, type) => {
    try {
      const url =
        type === 'friend'
          ? `/api/respondFriendRequest/${requestId}`
          : `/api/respondBlockRequest/${requestId}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepted }),
      })
      const data = await response.json()
      if (response.ok) {
        if (type === 'friend') {
          setFriendRequests(
            friendRequests.filter((request) => request.id !== requestId)
          )
        } else {
          setBlockRequests(
            blockRequests.filter((request) => request.id !== requestId)
          )
        }
        alert(`Request has been ${accepted ? 'accepted' : 'rejected'}.`)
      } else {
        throw new Error(data.message || 'Failed to respond to request')
      }
    } catch (error) {
      console.error('Error responding to request:', error)
      alert('Error responding to request: ' + error.message)
    }
  }

  return (
    <div className="view-messages-container">
      <h2>Friend Requests</h2>
      {friendRequests.map((request) => (
        <div key={request.id} className="request-item">
          <p>
            {request.senderName}: {request.message}
          </p>
          <button onClick={() => handleResponse(request.id, true, 'friend')}>
            Accept
          </button>
          <button onClick={() => handleResponse(request.id, false, 'friend')}>
            Reject
          </button>
        </div>
      ))}
      <h2>Block Requests</h2>
      {blockRequests.map((request) => (
        <div key={request.id} className="request-item">
          <p>
            {request.senderName}: {request.message}
          </p>
          <button onClick={() => handleResponse(request.id, true, 'block')}>
            Accept
          </button>
          <button onClick={() => handleResponse(request.id, false, 'block')}>
            Reject
          </button>
        </div>
      ))}
    </div>
  )
}

export default ViewMessage
