import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle
} from "react-leaflet";
import L from "leaflet";
import { User } from "./types";

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

interface MapComponentProps {
  users: User[];
  nearbyResults: User[];
  searchCenter: { lat: number; lon: number; radius: number; address: string } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ users, nearbyResults, searchCenter }) => {
  return (
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
          <Popup>🐕 Nearby: {user.username}</Popup>
        </Marker>
      ))}
      {searchCenter && (
        <>
          <Marker 
            position={[searchCenter.lat, searchCenter.lon]}
            icon={redIcon}
          >
            <Popup>📍 Search Center: {searchCenter.address}</Popup>
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
  );
};

export default MapComponent;
