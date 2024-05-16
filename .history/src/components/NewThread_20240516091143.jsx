import React, { useState, useEffect } from 'react'
import './NewThread.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import markerIconUrl from '../figs/marker.png'

const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12.5, 41],
  popupAnchor: [1, -34],
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

function getNewYorkTimeISO() {
  const options = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
  const parts = dateTimeFormat.formatToParts(new Date())
  const { year, month, day, hour, minute, second } = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
}

function NewThread({ onThreadCreated, userId, setShowForm }) {
  const [tType, setTType] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('')
  const [mTitle, setMTitle] = useState('')
  const [mLocation, setMLocation] = useState('')
  const [mapVisible, setMapVisible] = useState(false)
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
    try {
      const response = await fetch('http://192.168.1.27:3000/api/getfriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId }),
      })
      const data = await response.json()
      if (response.ok) {
        setFriends(data.data)
        if (data.data.length > 0) {
          setTargetName(data.data[0].friendID.toString())
          setSelectedName(data.data[0].friendName)
        }
      } else {
        throw new Error(data.message || 'Failed to fetch friends')
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
      alert(error.message)
    }
  }

  const fetchNeighbors = async () => {
    try {
      const response = await fetch('http://192.168.1.27:3000/api/getneighbor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userId }),
      })
      const data = await response.json()
      if (response.ok) {
        setNeighbors(data.data)
        if (data.data.length > 0) {
          setTargetName(data.data[0].neighborID.toString())
          setSelectedName(data.data[0].neighborName)
        }
      } else {
        throw new Error(data.message || 'Failed to fetch neighbors')
      }
    } catch (error) {
      console.error('Error fetching neighbors:', error)
      alert(error.message)
    }
  }

  const handleSelectChange = (event) => {
    const selectedID = event.target.value
    setTargetName(selectedID)
    const selected = (tType === 'SingleFriend' ? friends : neighbors).find(
      (item) => item.id.toString() === selectedID
    )
    if (selected) {
      setSelectedName(selected.name)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID: userId,
      tCreateTime: getNewYorkTimeISO(),
      tReceiverID: targetName,
      mTitle,
      mLocation,
      textBody: threadContent,
    }

    try {
      const response = await fetch('http://192.168.1.27:3000/api/addthread', {
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

        {tType === 'SingleFriend' && friends.length > 0 && (
          <div>
            <select value={targetName} onChange={handleSelectChange}>
              {friends.map((friend) => (
                <option key={friend.friendID} value={friend.friendID}>
                  {friend.friendName}
                </option>
              ))}
            </select>
            <div>Selected: {selectedName}</div>
          </div>
        )}

        {tType === 'SingleNeighbor' && neighbors.length > 0 && (
          <div>
            <select value={targetName} onChange={handleSelectChange}>
              {neighbors.map((neighbor) => (
                <option key={neighbor.neighborID} value={neighbor.neighborID}>
                  {neighbor.neighborName}
                </option>
              ))}
            </select>
            <div>Selected: {selectedName}</div>
          </div>
        )}

        <input
          type="text"
          placeholder="Enter title..."
          value={mTitle}
          onChange={(e) => setMTitle(e.target.value)}
        />

        <button type="button" onClick={() => setMapVisible(!mapVisible)}>
          {mapVisible ? 'Hide Location' : 'Add Location'}
        </button>
        {mapVisible && (
          <LocationPicker onLocationSelect={(latlng) => setMLocation(latlng)} />
        )}

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
