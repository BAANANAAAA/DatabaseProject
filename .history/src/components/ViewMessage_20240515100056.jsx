import React, { useState, useEffect } from 'react'
import './ViewMessage.css'

function ViewMessage(props) {
  const { userId } = props
  const [friendRequests, setFriendRequests] = useState([])
  const [blockRequests, setBlockRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      // const friendResponse = await fetch(
      //   'http://192.168.1.27:3000/api/getfriendapplication',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ userId }),
      //   }
      // )
      const blockResponse = await fetch(
        'http://192.168.1.27:3000/api/getblockapplication',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      )
      const friendData = await friendResponse.json()
      const blockData = await blockResponse.json()
      if (friendResponse.ok && blockResponse.ok) {
        setFriendRequests(friendData.data)
        setBlockRequests(blockData.data)
      } else {
        throw new Error('Failed to fetch requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      alert('Error fetching requests: ' + error.message)
    }
  }

  const handleResponse = async (fromID, accepted, type) => {
    try {
      const url =
        type === 'friend'
          ? `/api/respondFriendRequest/${fromID}`
          : `/api/respondBlockRequest/${fromID}`
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
            friendRequests.filter((request) => request.fromID !== fromID)
          )
        } else {
          setBlockRequests(
            blockRequests.filter((request) => request.fromID !== fromID)
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
      <div className="card">
        <h2>Friend Requests</h2>
        {friendRequests.map((request) => (
          <div key={request.fromID} className="request-item">
            <p>
              {request.senderName}: {request.message}
            </p>
            <button
              onClick={() => handleResponse(request.fromID, true, 'friend')}>
              Accept
            </button>
            <button
              onClick={() => handleResponse(request.fromID, false, 'friend')}>
              Reject
            </button>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Block Requests</h2>
        {blockRequests.map((request) => (
          <div key={request.fromID} className="request-item">
            <p>
              {request.senderName}: {request.message}
            </p>
            <button
              onClick={() => handleResponse(request.fromID, true, 'block')}>
              Accept
            </button>
            <button
              onClick={() => handleResponse(request.fromID, false, 'block')}>
              Reject
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewMessage
