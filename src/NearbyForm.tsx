import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "./types"

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
    } catch (err) {
      console.error(err);
      setMessage("Error searching nearby users");
    }
  };

  return (
    <div>
      <h2>Search Nearby</h2>
      <form onSubmit={handleNearbySearch}>
        <div style={{ marginBottom: "10px" }}>
          <label>Address:</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Radius (mi):</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            min={1}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Search Nearby
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default NearbyForm;
