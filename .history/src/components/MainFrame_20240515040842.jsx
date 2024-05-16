import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [expanded, setExpanded] = useState({})
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all')
  const [friends, setFriends] = useState([])
  const [neighbours, setNeighbours] = useState([])
  const [selectedFriends, setSelectedFriends] = useState([])
  const [selectedNeighbours, setSelectedNeighbours] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentReplyId, setCurrentReplyId] = useState(null)

  // 新增thread的状态
  const [threadType, setThreadType] = useState('')
  const [threadCreatorID, setThreadCreatorID] = useState('')
  const [threadReceiverID, setThreadReceiverID] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')

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
    // 其他用户信息...
  ]

  // Fetch targets based on selected type
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

  // Handler for submitting a new thread
  const submitThread = async () => {
    const threadData = {
      tType: threadType,
      tCreatorID: threadCreatorID,
      tReceiverID: threadReceiverID,
      tCreateTime: new Date().toISOString(),
      toBlockID: toBlockID,
      toHoodID: toHoodID,
    }

    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(threadData),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Thread submitted successfully!')
        // Reset form fields here if needed
      } else {
        throw new Error(data.message || 'Failed to submit thread')
      }
    } catch (error) {
      console.error('Error submitting thread:', error)
      alert('Error submitting thread: ' + error.message)
    }
  }

  return (
    <div className="MainFrame">
      {/* Existing UI components */}
      <div className="new-thread-form">
        <h3>Create New Thread</h3>
        <input
          type="text"
          placeholder="Thread Type"
          value={threadType}
          onChange={(e) => setThreadType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Creator ID"
          value={threadCreatorID}
          onChange={(e) => setThreadCreatorID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Receiver ID"
          value={threadReceiverID}
          onChange={(e) => setThreadReceiverID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Block ID"
          value={toBlockID}
          onChange={(e) => setToBlockID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Hood ID"
          value={toHoodID}
          onChange={(e) => setToHoodID(e.target.value)}
        />
        <button onClick={submitThread}>Submit Thread</button>
      </div>
    </div>
  )
}

export default MainFrame
