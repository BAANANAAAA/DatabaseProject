import React, { useState } from 'react'
import './MainFrame.css' // Ensure this CSS file is appropriately linked

function MainFrame() {
  const [searchTerm, setSearchTerm] = useState('')
  const [replies, setReplies] = useState({})
  const users = [
    {
      id: 1,
      name: 'Alice',
      time: '19:00:00',
      avatar: 'path_to_avatar1.png',
      message: 'Hello world!',
    },
    {
      id: 2,
      name: 'Bob',
      time: '19:00:00',
      avatar: 'path_to_avatar2.png',
      message: 'Second post here!',
    },
  ]

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }))
  }

  const submitReply = (id) => {
    console.log(`Reply to ${id}: `, replies[id])
    // Here you can add functionality to actually send reply data to your backend
  }

  return (
    <div className="MainFrame">
      <div className="content">
        {users.map((user) => (
          <div key={user.id} className="post-card">
            <div className="post-header">
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="post-avatar"
              />
              <div>
                <div className="post-name">{user.name}</div>
                <div className="post-time">{user.time}</div>
              </div>
            </div>
            <div className="post-body">{user.message}</div>
            <div className="post-footer">
              <input
                type="text"
                placeholder="Reply..."
                value={replies[user.id] || ''}
                onChange={(e) => handleReplyChange(user.id, e.target.value)}
              />
              <button onClick={() => submitReply(user.id)}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
