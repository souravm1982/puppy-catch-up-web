import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "./types";
import AddressAutocomplete from "./AddressAutocomplete";

interface NearbyFormProps {
  onResults: (users: User[], searchCenter?: { lat: number; lon: number; radius: number; address: string }) => void;
}

const NearbyForm: React.FC<NearbyFormProps> = ({ onResults }) => {
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(5);
  const [message, setMessage] = useState("");

  // Get radius from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const radiusParam = urlParams.get('radius');
    if (radiusParam) {
      setRadius(parseFloat(radiusParam));
    }
  }, []);

  const handleNearbySearch = async (e: React.FormEvent) => {
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
        const res = await axios.post("http://127.0.0.1:8000/nearby", {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          radius: radius,
        });

        onResults(res.data, {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          radius: radius,
          address: address
        });
        setMessage(`Found ${res.data.length} users nearby`);
      } catch (backendErr) {
        // Backend not available, simulate nearby search with demo data
        console.log("Backend not available, simulating nearby search");
        const demoNearbyUsers: User[] = [
          { id: 101, username: "NearbyDogWalker", latitude: parseFloat(lat) + 0.01, longitude: parseFloat(lon) + 0.01 },
          { id: 102, username: "LocalPuppyOwner", latitude: parseFloat(lat) - 0.005, longitude: parseFloat(lon) + 0.005 },
        ];

        onResults(demoNearbyUsers, {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          radius: radius,
          address: address
        });
        setMessage(`Demo: Found ${demoNearbyUsers.length} users nearby`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error with address lookup");
    }
  };

  return (
    <>
      <h2>Search Nearby</h2>
      <form onSubmit={handleNearbySearch}>
        <div className="form-group">
          <label>Address:</label>
          <AddressAutocomplete
            value={address}
            onChange={setAddress}
            placeholder="Enter search address"
            required
          />
        </div>
        <div className="form-group">
          <label>Radius (miles):</label>
          <input
            className="form-input"
            type="number"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            min={1}
            placeholder="Search radius in miles"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search Nearby
        </button>
      </form>
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}
    </>
  );
};

export default NearbyForm;
