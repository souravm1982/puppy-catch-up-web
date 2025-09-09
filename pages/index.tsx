import React, { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { User } from "../src/types";
import NearbyForm from "../src/NearbyForm";
import AddressAutocomplete from "../src/AddressAutocomplete";
import Head from "next/head";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import("../src/MapComponent"), {
  ssr: false,
  loading: () => <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading map...</div>
});

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  // Nearby search state
  const [nearbyResults, setNearbyResults] = useState<User[]>([]);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lon: number; radius: number; address: string } | null>(null);

  // Demo data for when backend is not available
  const demoUsers: User[] = [
    { id: 1, username: "DogLover123", latitude: 47.7511, longitude: -122.1983 },
    { id: 2, username: "PuppyParent", latitude: 47.7749, longitude: -122.2034 },
    { id: 3, username: "GoldenRetrieverFan", latitude: 47.7558, longitude: -122.2156 },
    { id: 4, username: "LabradorLover", latitude: 47.6740, longitude: -122.1215 },
  ];

  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:8000/users/")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.log("Backend not available, using demo data");
        setUsers(demoUsers);
      });
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

      try {
        const res = await axios.post("http://127.0.0.1:8000/signup", {
          username,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });

        setMessage(`User ${res.data.user.name} created!`);
        setUsername("");
        setAddress("");
        fetchUsers();
      } catch (backendErr) {
        // Backend not available, simulate successful signup
        console.log("Backend not available, simulating signup");
        const newUser: User = {
          id: Date.now(),
          username: username,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
        setUsers(prev => [...prev, newUser]);
        setMessage(`Demo: User ${username} created successfully!`);
        setUsername("");
        setAddress("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error with address lookup");
    }
  };

  // Handler for nearby search results
  const handleNearbyResults = (users: User[], searchCenter?: { lat: number; lon: number; radius: number; address: string }) => {
    setNearbyResults(users);
    setSearchCenter(searchCenter || null);
  };

  return (
    <>
      <Head>
        <title>Puppy Catch Up - Find Nearby Dog Owners</title>
        <meta name="description" content="Connect with nearby dog owners and arrange puppy playdates in your area." />
      </Head>

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
          <DynamicMap 
            users={users}
            nearbyResults={nearbyResults}
            searchCenter={searchCenter}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
