import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame({ userId }) {
  const [messages, setMessages] = useState([])
  const [expandedThreadID, setExpandedThreadID] = useState(null)
  const [filter, setFilter] = useState('all')

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
              <div
                className="thread-header"
                onClick={() => toggleExpand(threadID)}>
                <img
                  src={threadMessages[0].tPhoto}
                  alt="Thread creator"
                  className="thread-photo"
                />
                <div>
                  <h3>{`Thread #${threadID} - ${threadMessages[0].tCreatorName}`}</h3>
                  <p>{`Created at: ${new Date(
                    threadMessages[0].tCreateTime
                  ).toLocaleString()}`}</p>
                </div>
                <button onClick={() => toggleExpand(threadID)}>
                  {expandedThreadID === threadID ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {expandedThreadID === threadID && (
                <div className="thread-messages">
                  {threadMessages.map((message) => (
                    <div key={message.messageID} className="message">
                      <h4>{message.mTitle}</h4>
                      <p>{message.textBody}</p>
                      <img
                        src={message.mPhoto}
                        alt={`${message.mCreatorName}'s avatar`}
                        className="message-photo"
                      />
                      <p>{`Created by: ${message.mCreatorName} at ${new Date(
                        message.mCreateTime
                      ).toLocaleString()}`}</p>
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