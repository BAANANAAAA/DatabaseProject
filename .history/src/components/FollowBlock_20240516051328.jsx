import React, { useState, useEffect } from 'react'
import './FollowBlock.css'

function FollowBlock({ userId }) {
  const [blocks, setBlocks] = useState([])
  const [selectedBlocks, setSelectedBlocks] = useState([])

  useEffect(() => {
    fetchBlocks()
  }, [])

  const fetchBlocks = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3000/api/getblock', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (response.ok) {
        setBlocks(data.blocks)
        if (data.blocks.length > 0) {
          setSelectedBlock(data.blocks[0].name)
        }
      } else {
        alert(`Error fetching blocks: ${data.message}`)
      }
    } catch (error) {
      console.error('Error fetching blocks:', error)
      alert('Failed to fetch blocks. Please try again later.')
    }
  }

  const handleBlockChange = (blockID) => {
    const currentIndex = selectedBlocks.indexOf(blockID)
    const newChecked = [...selectedBlocks]

    if (currentIndex === -1) {
      newChecked.push(blockID)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setSelectedBlocks(newChecked)
  }

  const handleFollowBlock = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://192.168.1.27:3000/api/followblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId, blockIDs: selectedBlocks }),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Blocks followed successfully!')
        setSelectedBlocks([])
      } else {
        alert(`Error following blocks: ${data.message}`)
      }
    } catch (error) {
      console.error('Error following blocks:', error)
      alert('Failed to follow blocks. Please try again later.')
    }
  }

  return (
    <div className="follow-block-container">
      <h2>Follow Blocks</h2>
      <form onSubmit={handleFollowBlock}>
        {blocks.map((block) => (
          <div key={block.blockID}>
            <label>
              <input
                type="checkbox"
                checked={selectedBlocks.includes(block.blockID)}
                onChange={() => handleBlockChange(block.blockID)}
              />
              {block.blockName}
            </label>
          </div>
        ))}
        <button type="submit">Follow Selected Blocks</button>
      </form>
    </div>
  )
}

export default FollowBlock
