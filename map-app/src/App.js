import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, { useEffect, useState } from "react";

import { Icon, divIcon, marker, point } from "leaflet";
import axios from "axios";

// create custom icon
// const customIcon = new Icon({
//   // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
//   iconUrl: require("./icons/placeholder.png"),
//   iconSize: [38, 38] // size of the icon
// });

const customIconList = [];
for (let i = 0; i < 10; i++) {
  // const i = 2
  const path_icon = "./icons/" + i.toString() + ".png";
  const temp_item = new Icon({
    // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconUrl: require("./icons/" + i.toString() + ".png"),
    iconSize: [25, 25], // size of the icon
  });
  customIconList.push(temp_item);
}

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(10, 10, true),
  });
};

export default function App() {
  const [locations, setLocations] = useState([]);
  const [CheckedLabelArray, setCheckedLabelArray] = useState([4]);
  const [districtArray, setDistrictArray] = useState([]);
  const postData = {
    period: ["period_16_55"],
    weekday: [1],
    // "district": ["quan_thu_duc"]
  };
  const mystyple = {
    height: "100vh",
    width: "100%",
  };
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOptions(selectedValues);
  };

  useEffect(() => {
    // Gửi yêu cầu lấy thông tin vị trí từ server FastAPI
    const get_locations = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/data_mining/K_means",
          postData
        );
        setLocations(res.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    // const get_district = async () => {
    //   try {
    //     const res = await axios.get('http://localhost:8000/data_mining/K_means', postData)
    //     console.log("res", res.data[0])
    //     setLocations(res.data)
    //   }
    //   catch(error){
    //     console.error('Error fetching locations:', error)
    //   }

    // }
    get_locations();
  }, []);
  console.log("locations: ", locations);
  return (
    <div style={mystyple}>
      {/* OPEN STREEN MAPS TILES */}
      <h2>Multi-Select Component</h2>
      <select multiple value={selectedOptions} onChange={handleOptionChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        <option value="option4">Option 4</option>
      </select>
      <div>
        <h3>Selected Options:</h3>
        {selectedOptions.length === 0 ? (
          <p>No options selected.</p>
        ) : (
          <ul>
            {selectedOptions.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        )}
      </div>

      <MapContainer center={[10.8231, 106.6297]} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {locations.map((location_item) =>
            location_item.seg_info_list.map((marker) => {
              if (CheckedLabelArray.includes(location_item.label)) {
                return (
                  <Marker
                    position={marker.position}
                    icon={customIconList[location_item.label]}
                  >
                    <Popup>{location_item.label}</Popup>
                  </Marker>
                );
              } else {
                return null; // hoặc bạn có thể trả về phần tử rỗng <></> nếu bạn không muốn trả về null
              }
            })
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
