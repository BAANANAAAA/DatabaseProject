import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame(props) {
  const { userId } = props
  const [expanded, setExpanded] = useState({})
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all')
  const [modalVisible, setModalVisible] = useState(false)
  const [currentReplyId, setCurrentReplyId] = useState(null)
  const [selectedTargetType, setSelectedTargetType] = useState('')
  const [targetData, setTargetData] = useState({
    friends: [],
    neighbours: [],
    selectedFriends: [],
    selectedNeighbours: [],
  })

  const fetchTargets = async (type) => {
    const response = await fetch(`/api/${type}`)
    const data = await response.json()
    setTargetData((previousState) => ({
      ...previousState,
      [type]: data[type],
    }))
  }

  useEffect(() => {
    if (selectedTargetType) {
      fetchTargets(selectedTargetType)
    }
  }, [selectedTargetType])

  const handleReplyChange = (id, value) => {
    setReplies((previousReplies) => ({ ...previousReplies, [id]: value }))
  }

  const handleSelectTarget = (type, name, checked) => {
    const updatedSelectionType = `selected${
      type.charAt(0).toUpperCase() + type.slice(1)
    }`
    setTargetData((previousState) => ({
      ...previousState,
      [updatedSelectionType]: checked
        ? [...previousState[updatedSelectionType], name]
        : previousState[updatedSelectionType].filter((n) => n !== name),
    }))
  }

  const handleSelectAll = (type, checked) => {
    const selectionType = `selected${
      type.charAt(0).toUpperCase() + type.slice(1)
    }`
    const targetType = type
    setTargetData((previousState) => ({
      ...previousState,
      [selectionType]: checked
        ? previousState[targetType].map((t) => t.name)
        : [],
    }))
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
    const target =
      selectedTargetType === 'friend'
        ? targetData.selectedFriends
        : selectedTargetType === 'neighbour'
        ? targetData.selectedNeighbours
        : selectedTargetType

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
        setReplies((previousReplies) => ({
          ...previousReplies,
          [currentReplyId]: '',
        }))
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
    setExpanded((previousExpanded) => ({
      ...previousExpanded,
      [id]: !previousExpanded[id],
    }))
  }

  return (
    <div className="MainFrame">
      <div className="sidebar">
        {['all', 'hood', 'friend', 'block', 'neighbour'].map((filter) => (
          <button
            key={filter}
            className={currentFilter === filter ? 'active' : ''}
            onClick={() => setCurrentFilter(filter)}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div className="content">
        {users
          .filter(
            (user) => currentFilter === 'all' || user.location === currentFilter
          )
          .map((user) => (
            <div key={user.id} className="post-card">
              <div
                className="post-header"
                onClick={() => toggleExpand(user.id)}>
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
                  onChange={(event) =>
                    handleReplyChange(user.id, event.target.value)
                  }
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
              onChange={(event) => setSelectedTargetType(event.target.value)}>
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
