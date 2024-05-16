import React, { useState } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [expanded, setExpanded] = useState({})
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all') // To manage the filter
  const users = [
    {
      id: 1,
      name: 'Alice',
      time: '19:00:00',
      location: 'hood',
      avatar: 'path_to_avatar1.png',
      title: 'Introduction to React',
      replies: [
        {
          username: 'John',
          avatar: 'path_to_avatar2.png',
          message: 'Good morning!',
        },
        {
          username: 'Sarah',
          avatar: 'path_to_avatar3.png',
          message: 'How are you doing?',
        },
      ],
    },
    {
      id: 2,
      name: 'Bob',
      time: '19:00:00',
      location: 'friend',
      avatar: 'path_to_avatar4.png',
      title: 'Advanced React Patterns',
      replies: [
        {
          username: 'Mike',
          avatar: 'path_to_avatar5.png',
          message: 'Nice post!',
        },
      ],
    },
    {
      id: 3,
      name: 'Charlie',
      time: '19:00:00',
      location: 'block',
      avatar: 'path_to_avatar6.png',
      title: 'Handling State',
      replies: [],
    },
  ]

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }))
  }

  const submitReply = (id) => {
    console.log(`Reply from ${id}: ${replies[id]}`)
    // Optionally, clear the input after submission
    setReplies((prev) => ({ ...prev, [id]: '' }))
    // TODO: Implement actual send to backend or handling logic
  }

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredUsers =
    currentFilter === 'all'
      ? users
      : users.filter((user) => user.location === currentFilter)

  return (
    <div className="MainFrame">
      <div className="sidebar">
        {/* <button onClick={() => setCurrentFilter('all')}>All</button>
        <button onClick={() => setCurrentFilter('hood')}>Hood</button>
        <button onClick={() => setCurrentFilter('friend')}>Friend</button>
        <button onClick={() => setCurrentFilter('block')}>Block</button> */}
        <div className="sidebar">
          <button
            className={currentFilter === 'all' ? 'active' : ''}
            onClick={() => setCurrentFilter('all')}>
            All
          </button>
          <button
            className={currentFilter === 'hood' ? 'active' : ''}
            onClick={() => setCurrentFilter('hood')}>
            Hood
          </button>
          <button
            className={currentFilter === 'friend' ? 'active' : ''}
            onClick={() => setCurrentFilter('friend')}>
            Friend
          </button>
          <button
            className={currentFilter === 'block' ? 'active' : ''}
            onClick={() => setCurrentFilter('block')}>
            Block
          </button>
        </div>
      </div>
      <div className="content">
        {filteredUsers.map((user) => (
          <div key={user.id} className="post-card">
            <div className="post-header" onClick={() => toggleExpand(user.id)}>
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="post-avatar"
              />
              <div>
                <div className="post-name">
                  {user.name} - {user.time} - {user.location}
                </div>
                <div className="post-title">{user.title}</div>
              </div>
              <button className="expand-button">
                {expanded[user.id] ? '▲' : '▼'}
              </button>
            </div>
            <div className="post-reply-input">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replies[user.id] || ''}
                onChange={(e) => handleReplyChange(user.id, e.target.value)}
              />
              <button onClick={() => submitReply(user.id)}>Send</button>
            </div>
            {expanded[user.id] && (
              <div className="post-details">
                {user.replies.map((reply, index) => (
                  <div key={index} className="reply">
                    <img
                      src={reply.avatar}
                      alt={`${reply.username}'s avatar`}
                      className="reply-avatar"
                    />
                    <div className="reply-message">
                      <strong>{reply.username}:</strong> {reply.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
