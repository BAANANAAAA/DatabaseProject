import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Search.css'
import markerIconUrl from '../figs/marker.png'

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

  const fetchData = async (url, options) => {
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }

  const handleSearch = async () => {
    const data = await fetchData(
      'http://192.168.1.27:3000/api/searchkeywordmessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: userId, keyword: searchTerm }),
      }
    )

    if (data && data.success) {
      setMessages(data.data)
    } else {
      setMessages([])
      console.error('Search failed:', data.message)
    }
  }

  const handleLocationSearch = async () => {
    if (location) {
      const data = await fetchData(
        'http://192.168.1.27:3000/api/searchlocationmessage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userID: userId,
            location: location,
            radius: 0.1,
          }),
        }
      )

      if (data && data.success) {
        setLocationMessages(data.data)
        console.log(data)
      } else {
        setLocationMessages([])
        alert(data.message)
      }
    }
  }

  function LocationMarker() {
    useMapEvents({
      click: (e) => setLocation(e.latlng),
    })

    return location ? <Marker position={location} icon={customIcon} /> : null
  }

  return (
    <div className="search-container">
      <div className="search-section">
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
              <img src={message.mPhoto} alt="Profile" />
            </div>
          ))}
        </div>
      </div>
      <div className="search-section">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={13}
          style={{ height: '300px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
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
              <img src={message.mPhoto} alt="Profile" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search
