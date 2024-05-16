import markerIconUrl from '../figs/marker.png'
import './Search.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Search.css'

const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12.5, 41],
  popupAnchor: [1, -34],
})

function Search({ userId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState(null)
  const [messages, setMessages] = useState([])
  const [locationMessages, setLocationMessages] = useState([])
  const navigate = useNavigate()

  const handleSearch = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.27:3000/api/searchkeywordmessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userId,
            keyword: searchTerm,
          }),
        }
      )

      const data = await response.json()
      if (data.success && data.data) {
        setMessages(data.data)
      } else {
        console.error('Search failed:', data.message)
        setMessages([])
      }
    } catch (error) {
      console.error('Error searching:', error)
      setMessages([])
    }
  }

  const handleLocationSearch = async () => {
    if (location) {
      try {
        const response = await fetch(
          'http://192.168.1.27:3000/api/searchlocationmessage',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userID: userId,
              location: location,
            }),
          }
        )

        const data = await response.json()
        if (data.success && data.data) {
          setLocationMessages(data.data)
        } else {
          console.error('Location search failed:', data.message)
          setLocationMessages([])
        }
      } catch (error) {
        console.error('Error searching location:', error)
        setLocationMessages([])
      }
    }
  }

  function LocationPicker() {
    function LocationMarker() {
      useMapEvents({
        click: (e) => {
          const latlng = e.latlng
          setLocation(latlng)
        },
      })

      return location === null ? null : (
        <Marker position={location} icon={customIcon} />
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

  return (
    <div className="search-container" style={{ display: 'flex' }}>
      <div className="search-section" style={{ width: '50%' }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="search-results">
          {messages.map((message) => (
            <div key={message.messageID} className="message">
              <h4>{message.mTitle}</h4>
              <p>{message.textBody}</p>
              <p>
                Created by: {message.mCreatorName} on{' '}
                {new Date(message.mCreateTime).toLocaleDateString()}
              </p>
              <img
                src={message.mPhoto}
                alt="Profile"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="search-section" style={{ width: '50%' }}>
        <LocationPicker />
        <button onClick={handleLocationSearch}>Search by Location</button>
        <div className="search-results">
          {locationMessages.map((message) => (
            <div key={message.messageID} className="message">
              <h4>{message.mTitle}</h4>
              <p>{message.textBody}</p>
              <p>
                Created by: {message.mCreatorName} on{' '}
                {new Date(message.mCreateTime).toLocaleDateString()}
              </p>
              <img
                src={message.mPhoto}
                alt="Profile"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search
