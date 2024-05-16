import React, { useState } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [searchTerm, setSearchTerm] = useState('')
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all') // To manage the filter
  const users = [
    {
      id: 1,
      name: 'Alice',
      time: '19:00:00',
      location: 'hood',
      avatar: 'path_to_avatar1.png',
      message: 'Hello world!',
    },
    {
      id: 2,
      name: 'Bob',
      time: '19:00:00',
      location: 'friend',
      avatar: 'path_to_avatar2.png',
      message: 'Second post here!',
    },
    {
      id: 3,
      name: 'Charlie',
      time: '19:00:00',
      location: 'block',
      avatar: 'path_to_avatar3.png',
      message: 'Block this!',
    },
  ]

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }))
  }

  const submitReply = (id) => {
    console.log(`Reply to ${id}: `, replies[id])
    // Here you can add functionality to actually send reply data to your backend
  }

  const filteredUsers =
    currentFilter === 'all'
      ? users
      : users.filter((user) => user.location === currentFilter)

  return (
    <div className="MainFrame">
      <div className="sidebar">
        <button onClick={() => setCurrentFilter('all')}>All</button>
        <button onClick={() => setCurrentFilter('hood')}>Hood</button>
        <button onClick={() => setCurrentFilter('friend')}>Friend</button>
        <button onClick={() => setCurrentFilter('block')}>Block</button>
      </div>
      <div className="content">
        {filteredUsers.map((user) => (
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
                <div className="post-location">From: {user.location}</div>
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
