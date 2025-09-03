import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";
import { User } from "./types";
import NearbyForm from "./NearbyForm";
import AddressAutocomplete from "./AddressAutocomplete";

// Fix default marker issue in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create green marker icon for nearby results
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create red marker icon for search center
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  // Nearby search state
  const [nearbyResults, setNearbyResults] = useState<User[]>([]);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lon: number; radius: number; address: string } | null>(null);

  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:8000/users/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Signup form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const geoRes = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        { params: { q: address, format: "json" } }
      );

      if (!geoRes.data || geoRes.data.length === 0) {
        setMessage("Address not found");
        return;
      }

      const { lat, lon } = geoRes.data[0];

      const res = await axios.post("http://127.0.0.1:8000/signup", {
        username,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      });

      setMessage(`User ${res.data.user.name} created!`);

      setUsername("");
      setAddress("");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("Error signing up");
    }
  };

  // Handler for nearby search results
  const handleNearbyResults = (users: User[], searchCenter?: { lat: number; lon: number; radius: number; address: string }) => {
    setNearbyResults(users);
    setSearchCenter(searchCenter || null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar */}
      <div className="left-panel">
        <div className="panel-content">
          {/* Sign Up Section */}
          <div className="form-section">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  placeholder="Enter your address"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Sign Up
              </button>
            </form>
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>

          <hr className="section-divider" />

          {/* Nearby Search Section */}
          <div className="form-section">
            <NearbyForm onResults={handleNearbyResults} />
          </div>

          {/* Results Section */}
          {nearbyResults.length > 0 && (
            <div className="results-section">
              <h4>Nearby Users Found</h4>
              <ul className="results-list">
                {nearbyResults.map((u) => (
                  <li key={u.id}>{u.username}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div style={{ width: "75%" }}>
        <MapContainer
          center={[47.76, -122.24]} // Kenmore / Bothell area
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {users.map((user) => (
            <Marker key={user.id} position={[user.latitude, user.longitude]}>
              <Popup>{user.username}</Popup>
            </Marker>
          ))}
          {nearbyResults.map((user) => (
            <Marker 
              key={`nearby-${user.id}`} 
              position={[user.latitude, user.longitude]}
              icon={greenIcon}
            >
              <Popup>🟢 Nearby: {user.username}</Popup>
            </Marker>
          ))}
          {searchCenter && (
            <>
              <Marker 
                position={[searchCenter.lat, searchCenter.lon]}
                icon={redIcon}
              >
                <Popup>🔴 Search Center: {searchCenter.address}</Popup>
              </Marker>
              <Circle
                center={[searchCenter.lat, searchCenter.lon]}
                radius={searchCenter.radius * 1609.34} // Convert miles to meters
                pathOptions={{
                  color: 'red',
                  fillColor: 'red',
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
