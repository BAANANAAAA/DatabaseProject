import React, { useState } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [expanded, setExpanded] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all') // Manage the filter
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
        <button onClick={() => setCurrentFilter('all')}>All</button>
        <button onClick={() => setCurrentFilter('hood')}>Hood</button>
        <button onClick={() => setCurrentFilter('friend')}>Friend</button>
        <button onClick={() => setCurrentFilter('block')}>Block</button>
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
            {expanded[user.id] && (
              <div className="post-details">
                <div className="post-body">{user.message}</div>
                <div className="post-replies">
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
