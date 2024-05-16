import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame(props) {
  const { userId } = props
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
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchTargets = async (type) => {
      const response = await fetch(`/api/${type}`)
      const data = await response.json()
      if (type === 'friends') {
        setFriends(data.friends)
      } else if (type === 'neighbours') {
        setNeighbours(data.neighbours)
      }
    }

    const fetchUsers = async (userId) => {
      try {
        const response = await fetch(
          'http://192.168.1.27:3000/api/getmessage',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId }), // 在这里发送 userId
          }
        )
        const result = await response.json()
        if (result.success) {
          const formattedUsers = result.data.map((message) => ({
            id: message.messageID,
            name: message.mCreatorName,
            time: new Date(message.mCreateTime).toLocaleTimeString(),
            location: message.threadType,
            avatar: message.mPhoto,
            title: message.mTitle,
            replies: [],
          }))
          setUsers(formattedUsers)
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error('Failed to fetch user messages:', error)
      }
    }

    fetchUsers()
    if (selectedTargetType === 'friend') {
      fetchTargets('friends')
    } else if (selectedTargetType === 'neighbour') {
      fetchTargets('neighbours')
    }
  }, [selectedTargetType, userId])

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
    const updateSelection = checked ? type.map((t) => t.name) : []
    if (type === 'friends') {
      setSelectedFriends(updateSelection)
    } else if (type === 'neighbours') {
      setSelectedNeighbours(updateSelection)
    }
  }

  const handleSelectTarget = (type, name, checked) => {
    const updateSelection = checked
      ? [...type, name]
      : type.filter((t) => t !== name)
    if (type === 'friends') {
      setSelectedFriends(updateSelection)
    } else if (type === 'neighbours') {
      setSelectedNeighbours(updateSelection)
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
                {/* Optionally, display replies here */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
