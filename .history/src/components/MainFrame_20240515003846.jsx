import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [expanded, setExpanded] = useState({})
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all') // To manage the filter
  const [selectedTargets, setSelectedTargets] = useState({}) // To manage selected targets
  const [otherTargetNames, setOtherTargetNames] = useState({}) // To manage other target names
  const [friends, setFriends] = useState([])
  const [neighbours, setNeighbours] = useState([])
  const [availableTargets, setAvailableTargets] = useState([]) // To store the targets to choose from

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

  const fetchTargets = async (type) => {
    const response = await fetch(`/api/${type}`)
    const data = await response.json()
    return data[type]
  }

  useEffect(() => {
    if (selectedTargets[currentFilter] === 'friend') {
      fetchTargets('friends').then((data) => setFriends(data))
    } else if (selectedTargets[currentFilter] === 'neighbour') {
      fetchTargets('neighbours').then((data) => setNeighbours(data))
    }
  }, [selectedTargets, currentFilter])

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }))
  }

  const handleTargetChange = (id, value) => {
    setSelectedTargets((prev) => ({ ...prev, [id]: value }))
    if (value !== 'other') {
      setOtherTargetNames((prev) => ({ ...prev, [id]: '' }))
    }

    if (value === 'friend') {
      fetchTargets('friends').then((data) => setAvailableTargets(data))
    } else if (value === 'neighbour') {
      fetchTargets('neighbours').then((data) => setAvailableTargets(data))
    } else {
      setAvailableTargets([])
    }
  }

  const handleOtherTargetNameChange = (id, value) => {
    setOtherTargetNames((prev) => ({ ...prev, [id]: value }))
  }

  const submitReply = async (id) => {
    const replyMessage = replies[id]
    const target =
      selectedTargets[id] === 'other'
        ? otherTargetNames[id]
        : selectedTargets[id]
    console.log(`Reply from ${id} to ${target}: ${replyMessage}`)

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, message: replyMessage, target }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Reply submitted successfully')
        // Optionally, update the UI with the new reply
        // Here we just clear the input after submission
        setReplies((prev) => ({ ...prev, [id]: '' }))
        setSelectedTargets((prev) => ({ ...prev, [id]: 'hood' }))
        setOtherTargetNames((prev) => ({ ...prev, [id]: '' }))
      } else {
        throw new Error(data.message || 'Failed to submit reply')
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('Error submitting reply: ' + error.message)
    }
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
        <button
          className={currentFilter === 'neighbour' ? 'active' : ''}
          onClick={() => setCurrentFilter('neighbour')}>
          Neighbour
        </button>
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
              <select
                value={selectedTargets[user.id] || 'hood'}
                onChange={(e) => handleTargetChange(user.id, e.target.value)}>
                <option value="hood">Hood</option>
                <option value="block">Block</option>
                <option value="neighbour">Neighbour</option>
                <option value="friend">Friend</option>
              </select>
              {(selectedTargets[user.id] === 'friend' ||
                selectedTargets[user.id] === 'neighbour') && (
                <select multiple className="multiple-select">
                  {availableTargets.map((target) => (
                    <option key={target.id} value={target.name}>
                      {target.name}
                    </option>
                  ))}
                </select>
              )}
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
