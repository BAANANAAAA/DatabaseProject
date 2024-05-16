import React, { useState, useEffect } from 'react'

function ViewMessage() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/get-requests')
      const data = await response.json()
      if (response.ok) {
        setRequests(data.requests)
      } else {
        throw new Error(data.message || 'Failed to fetch requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      alert('Error fetching requests: ' + error.message)
    }
  }

  const handleResponse = async (requestId, accepted) => {
    try {
      const response = await fetch(`/api/respond-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepted }),
      })
      const data = await response.json()
      if (response.ok) {
        setRequests(requests.filter((request) => request.id !== requestId)) // Remove responded request from list
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
      <h2>Received Requests</h2>
      {requests.map((request) => (
        <div key={request.id} className="request-item">
          <p>
            {request.type} Request from {request.senderName}: {request.message}
          </p>
          <button onClick={() => handleResponse(request.id, true)}>
            Accept
          </button>
          <button onClick={() => handleResponse(request.id, false)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  )
}

export default ViewMessage
