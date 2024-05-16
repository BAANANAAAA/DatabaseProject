import React, { useState, useEffect } from 'react'
import './NewThread.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom icon setup for the marker, you might want to configure this as needed
const customIcon = new L.Icon({
  iconUrl: 'path_to_icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function LocationPicker({ onLocationSelect, onAddressSelect }) {
  const [position, setPosition] = useState(null)

  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const latlng = e.latlng
        setPosition(latlng)
        onLocationSelect(latlng)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.address) {
              const address = `${data.address.road || ''}, ${
                data.address.city || ''
              }, ${data.address.country || ''}`
              onAddressSelect(address)
            }
          })
      },
    })

    return position === null ? null : (
      <Marker position={position} icon={customIcon} />
    )
  }

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={13}
      style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}

function NewThread({ onThreadCreated, userId, setShowForm }) {
  const [tType, setTType] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [mTitle, setMTitle] = useState('')
  const [mLocation, setMLocation] = useState('')
  const [friends, setFriends] = useState([])
  const [neighbors, setNeighbors] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')

  useEffect(() => {
    if (tType === 'SingleFriend') {
      fetchFriends()
    } else if (tType === 'SingleNeighbor') {
      fetchNeighbors()
    }
  }, [tType, userId])

  const fetchFriends = async () => {
    /* existing fetchFriends function */
  }
  const fetchNeighbors = async () => {
    /* existing fetchNeighbors function */
  }
  const handleSelectChange = (event) => {
    /* existing handleSelectChange function */
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID: userId,
      tCreateTime: new Date().toISOString(),
      tReceiverID: targetName,
      toBlockID,
      toHoodID,
      mTitle,
      mLocation,
      textBody: threadContent,
    }
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thread),
      })
      if (response.ok) {
        onThreadCreated()
        setShowForm(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create thread')
      }
    } catch (error) {
      console.error('Error creating thread:', error)
      alert(error.message)
    }
  }

  return (
    <div className="NewThread">
      <form onSubmit={handleSubmit}>
        <select value={tType} onChange={(e) => setTType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="All">All</option>
          <option value="SingleFriend">Single Friend</option>
          <option value="SingleNeighbor">Single Neighbor</option>
          <option value="Friends">Friends</option>
          <option value="Neighbors">Neighbors</option>
          <option value="Block">Block</option>
          <option value="Hood">Hood</option>
        </select>

        {/* Dynamic Select Boxes */}

        <input
          type="text"
          placeholder="Enter title..."
          value={mTitle}
          onChange={(e) => setMTitle(e.target.value)}
        />

        <LocationPicker
          onLocationSelect={(latlng) => {
            console.log('Selected Lat/Lng:', latlng) // You can remove this if not needed
          }}
          onAddressSelect={(address) => setMLocation(address)}
        />

        <textarea
          placeholder="Enter thread content..."
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
          rows="4"></textarea>

        <button className="button" type="submit">
          Create Thread
        </button>
        <button
          type="button"
          className="button close-button"
          onClick={() => setShowForm(false)}>
          Close
        </button>
      </form>
    </div>
  )
}

export default NewThread
