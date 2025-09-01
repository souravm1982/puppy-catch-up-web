import React, { useState } from "react";
import axios from "axios";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1️⃣ Convert address to lat/lng using Nominatim
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: { q: address, format: "json" },
        }
      );

      if (!geoRes.data || geoRes.data.length === 0) {
        setMessage("Address not found");
        return;
      }

      const { lat, lon } = geoRes.data[0];

      // 2️⃣ Send to backend signup API
      const res = await axios.post("http://127.0.0.1:8000/signup", {
        username,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      });

      setMessage(`User ${res.data.username} created!`);
      setUsername("");
      setAddress("");
    } catch (err: any) {
      console.error("Signup error:", err);
      setMessage("Error signing up");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
};

export default SignupForm;
