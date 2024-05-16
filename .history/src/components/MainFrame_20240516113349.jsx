import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame({ userId }) {
  const [messages, setMessages] = useState([])
  const [expandedThreadID, setExpandedThreadID] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [filter, setFilter] = useState('all')

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
      mCreatorID: userId,
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
          fetchMessages()
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

  const groupedMessages = messages.reduce((acc, message) => {
    acc[message.threadID] = acc[message.threadID] || []
    acc[message.threadID].push(message)
    return acc
  }, {})

  const filteredThreads = Object.entries(groupedMessages).filter(
    ([, messages]) => filter === 'all' || messages[0].threadType === filter
  )

  return (
    <div className="main-frame">
      <div className="sidebar">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('SingleFriend')}>Friend</button>
        <button onClick={() => setFilter('Neighbor')}>Neighbor</button>
        <button onClick={() => setFilter('Block')}>Block</button>
        <button onClick={() => setFilter('Hood')}>Hood</button>
      </div>
      <div className="message-list">
        {filteredThreads.length > 0 ? (
          filteredThreads.map(([threadID, threadMessages]) => (
            <div key={threadID} className="thread">
              <div className="thread-header">
                <div
                  className="thread-info"
                  onClick={() => toggleExpand(threadID)}>
                  <img
                    src={threadMessages[0].tPhoto}
                    alt="Thread creator"
                    className="thread-photo"
                  />
                  <div>
                    <h6>{`Thread #${threadID}`}</h6>
                    <h3>{`${threadMessages[0].tCreatorName} - ${threadMessages[0].mTitle}`}</h3>
                    <p>{`Created at: ${new Date(
                      threadMessages[0].tCreateTime
                    ).toLocaleString()}`}</p>
                  </div>
                </div>
                <button
                  className="expand-button"
                  onClick={() => toggleExpand(threadID)}>
                  {expandedThreadID === threadID ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {expandedThreadID === threadID && (
                <div className="thread-messages">
                  {threadMessages.map((message) => (
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
                      <p>{`Created at: ${new Date(
                        message.mCreateTime
                      ).toLocaleString()}`}</p>
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
                            className="reply-input"
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
              )}
            </div>
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default MainFrame