import React, { useState, useEffect } from 'react'
import './FollowBlock.css'

function FollowBlock({ userId }) {
  const [blocks, setBlocks] = useState([])
  const [selectedBlock, setSelectedBlock] = useState('')

  useEffect(() => {
    fetchBlocks()
  }, [])

  const fetchBlocks = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3000/api/getblock')
      const data = await response.json()
      if (response.ok) {
        setBlocks(data.blocks) // Assuming the API returns an array of blocks under 'blocks'
        if (data.blocks.length > 0) {
          setSelectedBlock(data.blocks[0].name) // Automatically select the first block
        }
      } else {
        alert(`Error fetching blocks: ${data.message}`)
      }
    } catch (error) {
      console.error('Error fetching blocks:', error)
      alert('Failed to fetch blocks. Please try again later.')
    }
  }

  const handleFollowBlock = async (event) => {
    event.preventDefault()
    if (!selectedBlock) {
      alert('Please select a block to follow.')
      return
    }
    try {
      const response = await fetch('http://192.168.1.27:3000/api/followblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId, blockName: selectedBlock }),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Block followed successfully!')
        setSelectedBlock('') // Optionally reset the selected block
      } else {
        alert(`Error following block: ${data.message}`)
      }
    } catch (error) {
      console.error('Error following block:', error)
      alert('Failed to follow block. Please try again later.')
    }
  }

  return (
    <div className="follow-block-container">
      <h2>Follow a Block</h2>
      <form onSubmit={handleFollowBlock}>
        <label htmlFor="block-select">Choose a block:</label>
        <select
          id="block-select"
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}>
          {blocks.map((block) => (
            <option key={block.name} value={block.name}>
              {block.name}
            </option>
          ))}
        </select>
        <button type="submit">Follow Block</button>
      </form>
    </div>
  )
}

export default FollowBlock
