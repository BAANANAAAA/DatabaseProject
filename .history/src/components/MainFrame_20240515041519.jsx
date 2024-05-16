import React, { useState, useEffect } from 'react'
import NewThread from './NewThread'
import './MainFrame.css'

function MainFrame() {
  const [expanded, setExpanded] = useState({})
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all')
  const [selectedTargets, setSelectedTargets] = useState({})
  const [otherTargetNames, setOtherTargetNames] = useState({})
  const [friends, setFriends] = useState([])
  const [neighbours, setNeighbours] = useState([])
  const [selectedFriends, setSelectedFriends] = useState([])
  const [selectedNeighbours, setSelectedNeighbours] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentReplyId, setCurrentReplyId] = useState(null)
  const [selectedTargetType, setSelectedTargetType] = useState('')

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
    if (selectedTargetType === 'friend') {
      fetchTargets('friends').then((data) => setFriends(data))
    } else if (selectedTargetType === 'neighbour') {
      fetchTargets('neighbours').then((data) => setNeighbours(data))
    }
  }, [selectedTargetType])

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }))
  }

  const handleTargetChange = (id, value) => {
    setSelectedTargets((prev) => ({ ...prev, [id]: value }))
    if (value !== 'other') {
      setOtherTargetNames((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const handleOtherTargetNameChange = (id, value) => {
    setOtherTargetNames((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectAll = (type, checked) => {
    if (type === 'friend') {
      setSelectedFriends(checked ? friends.map((f) => f.name) : [])
    } else if (type === 'neighbour') {
      setSelectedNeighbours(checked ? neighbours.map((n) => n.name) : [])
    }
  }

  const handleSelectTarget = (type, name, checked) => {
    if (type === 'friend') {
      setSelectedFriends((prev) =>
        checked ? [...prev, name] : prev.filter((f) => f !== name)
      )
    } else if (type === 'neighbour') {
      setSelectedNeighbours((prev) =>
        checked ? [...prev, name] : prev.filter((n) => n !== name)
      )
    }
  }

  const openModal = (id) => {
    setCurrentReplyId(id)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setCurrentReplyId(null)
  }

  const submitReply = async () => {
    const replyMessage = replies[currentReplyId]
    let target = []
    if (selectedTargetType === 'friend') {
      target = selectedFriends
    } else if (selectedTargetType === 'neighbour') {
      target = selectedNeighbours
    } else {
      target = selectedTargetType
    }
    console.log(`Reply from ${currentReplyId} to ${target}: ${replyMessage}`)

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: currentReplyId,
          message: replyMessage,
          target,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Reply submitted successfully')
        setReplies((prev) => ({ ...prev, [currentReplyId]: '' }))
        setSelectedTargets((prev) => ({ ...prev, [currentReplyId]: 'hood' }))
        setOtherTargetNames((prev) => ({ ...prev, [currentReplyId]: '' }))
        setSelectedFriends([])
        setSelectedNeighbours([])
        closeModal()
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

  const handleThreadCreated = () => {
    console.log('New thread added')
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
              <button onClick={() => openModal(user.id)}>Send</button>
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
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Target</h3>
            <select
              value={selectedTargetType}
              onChange={(e) => setSelectedTargetType(e.target.value)}>
              <option value="hood">Hood</option>
              <option value="block">Block</option>
              <option value="neighbour">Neighbour</option>
              <option value="friend">Friend</option>
            </select>
            {selectedTargetType === 'friend' && (
              <div className="checkbox-group">
                <div className="select-all">
                  <input
                    type="checkbox"
                    id="select-all-friend"
                    onChange={(e) =>
                      handleSelectAll('friend', e.target.checked)
                    }
                  />
                  <label htmlFor="select-all-friend">Select All</label>
                </div>
                {friends.map((friend) => (
                  <div key={friend.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`checkbox-friend-${friend.name}`}
                      checked={selectedFriends.includes(friend.name)}
                      onChange={(e) =>
                        handleSelectTarget(
                          'friend',
                          friend.name,
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={`checkbox-friend-${friend.name}`}>
                      {friend.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {selectedTargetType === 'neighbour' && (
              <div className="checkbox-group">
                <div className="select-all">
                  <input
                    type="checkbox"
                    id="select-all-neighbour"
                    onChange={(e) =>
                      handleSelectAll('neighbour', e.target.checked)
                    }
                  />
                  <label htmlFor="select-all-neighbour">Select All</label>
                </div>
                {neighbours.map((neighbour) => (
                  <div key={neighbour.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`checkbox-neighbour-${neighbour.name}`}
                      checked={selectedNeighbours.includes(neighbour.name)}
                      onChange={(e) =>
                        handleSelectTarget(
                          'neighbour',
                          neighbour.name,
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={`checkbox-neighbour-${neighbour.name}`}>
                      {neighbour.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <button onClick={submitReply}>Confirm</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainFrame
