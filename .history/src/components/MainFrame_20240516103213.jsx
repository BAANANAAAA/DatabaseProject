import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame({ userId }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (userId) {
      fetch(`http://192.168.1.27:3000/api/getmessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMessages(data.data)
          } else {
            console.error('Failed to fetch messages:', data.message)
          }
        })
        .catch((error) => {
          console.error('Error fetching messages:', error)
        })
    }
  }, [userId])

  return (
    <div className="message-list">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message.messageID} className="message">
            <h3>{message.mTitle}</h3>
            <p>{message.textBody}</p>
            <img
              src={message.mPhoto}
              alt={`${message.mCreatorName}'s avatar`}
            />
            <p>
              Created by: {message.mCreatorName} at {message.mCreateTime}
            </p>
          </div>
        ))
      ) : (
        <p>No messages to display</p>
      )}
    </div>
  )
}

export default MainFrame
