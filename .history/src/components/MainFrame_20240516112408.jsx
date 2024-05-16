import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame({ userId }) {
  const [messages, setMessages] = useState([])
  const [expandedThreadID, setExpandedThreadID] = useState(null)
  const [filter, setFilter] = useState('all')
  const [replyingTo, setReplyingTo] = useState(null) // State to track which message is being replied to
  const [replyText, setReplyText] = useState('') // State to hold the text of the reply

  useEffect(() => {
    fetchMessages()
  }, [userId])

  function fetchMessages() {
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
  }

  function handleReplyChange(event) {
    setReplyText(event.target.value)
  }

  function submitReply(message) {
    const payload = {
      threadID: message.threadID,
      mTitle: `Re: ${message.mTitle}`,
      mCreateTime: new Date().toISOString(),
      mCreatorID: userId, // Assume userId is available from the context or props
      mLocation: null,
      textBody: `@${message.mCreatorName}: ${replyText}`,
      replyMessageID: message.messageID,
    }

    fetch(`http://192.168.1.27:3000/api/addmessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReplyText('')
          setReplyingTo(null)
          fetchMessages() // Refresh messages
        } else {
          console.error('Failed to post reply:', data.message)
        }
      })
      .catch((error) => {
        console.error('Error posting reply:', error)
      })
  }

  const toggleExpand = (threadID) => {
    setExpandedThreadID(expandedThreadID === threadID ? null : threadID)
  }

  return (
    <div className="main-frame">
      <div className="sidebar">{/* Sidebar Buttons */}</div>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.messageID} className="message">
            <div className="message-header">
              <img
                src={message.mPhoto}
                alt={`${message.mCreatorName}'s avatar`}
                className="message-photo"
              />
              <strong>{message.mCreatorName}</strong>
            </div>
            <h4>{message.mTitle}</h4>
            <p>{message.textBody}</p>
            <button onClick={() => setReplyingTo(message.messageID)}>
              Reply
            </button>
            {replyingTo === message.messageID && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submitReply(message)
                }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={handleReplyChange}
                  placeholder="Write your reply..."
                  required
                />
                <button type="submit">Send</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
