import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import axios from 'axios';

function Map() {
  const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     // Gửi yêu cầu lấy thông tin vị trí từ server FastAPI
//     axios.get('http://your-fastapi-server/locations')
//       .then(response => {
//         setLocations(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching locations:', error);
//       });
//   }, []);
  console.log("map function")
  return (
    <MapContainer center={[21.0285, 105.8542]} zoom={14} style={{ height: '00px', width: '100%' }}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19} // Thêm thuộc tính maxZoom
        minZoom={2} // Thêm thuộc tính minZoom
        />
      {locations.map(location => (
        <CircleMarker center={[location.latitude, location.longitude]} radius={5} key={location.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
