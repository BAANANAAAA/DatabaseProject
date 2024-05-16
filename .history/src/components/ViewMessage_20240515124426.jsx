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
      // const friendData = await friendResponse.json()
      const blockData = await blockResponse.json()
      // if (friendResponse.ok && blockResponse.ok) {
      if (blockResponse.ok) {
        // setFriendRequests(friendData.data)
        setBlockRequests(blockData.data)
      } else {
        throw new Error('Failed to fetch requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      alert('Error fetching requests: ' + error.message)
    }
  }

  const handleResponse = async (bAppID, accepted, type) => {
    const decision = accepted ? 'approved' : 'rejected'
    try {
      const url =
        type === 'friend'
          ? `http://192.168.1.27:3000/api/processfriendapplication`
          : `http://192.168.1.27:3000/api/processblockapplication`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, bAppID, decision }),
      })
      const data = await response.json()
      if (response.ok) {
        fetchRequests()
        if (type === 'friend') {
          setFriendRequests(
            friendRequests.filter((request) => request.fromID !== bAppID)
          )
        } else {
          setBlockRequests(
            blockRequests.filter((request) => request.fromID !== bAppID)
          )
        }
        alert(`Request has been ${decision}.`)
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
              {/* From ID: {request.fromID} - Request Time:{' '} */}
              From User: {request.name} - Request Time:{' '}
              {new Date(request.createTime).toLocaleString()}
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
              From User: {request.name} - Request Time:{' '}
              {new Date(request.bAppCreateTime).toLocaleString()} - Status:{' '}
              {request.appStatus}
              {request.userDecision && ` - Decision: ${request.userDecision}`}
            </p>
            {request.userDecision === 'approved' ? (
              <>
                <button
                  className="button approve-button"
                  disabled
                  style={{ backgroundColor: '#4caf50' }}>
                  Accept
                </button>
                <button
                  className="button reject-button disabled-button"
                  disabled>
                  Reject
                </button>
              </>
            ) : request.userDecision === 'rejected' ? (
              <>
                <button
                  className="button approve-button disabled-button"
                  disabled>
                  Accept
                </button>
                <button
                  className="button reject-button"
                  disabled
                  style={{ backgroundColor: '#f44336' }}>
                  Reject
                </button>
              </>
            ) : (
              <>
                <button
                  className="button approve-button"
                  onClick={() => handleResponse(request.bAppID, true, 'block')}>
                  Accept
                </button>
                <button
                  className="button reject-button"
                  onClick={() =>
                    handleResponse(request.bAppID, false, 'block')
                  }>
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewMessage
