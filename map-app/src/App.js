import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, { useEffect, useState } from 'react';

import { Icon, divIcon, marker, point } from "leaflet";
import axios from 'axios';

// create custom icon
// const customIcon = new Icon({
//   // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
//   iconUrl: require("./icons/placeholder.png"),
//   iconSize: [38, 38] // size of the icon
// });

const customIconList = []
for (let i = 0; i< 10; i++){
  // const i = 2
  const path_icon = "./icons/" + i.toString() + ".png";
  const temp_item = new Icon({
    // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconUrl: require("./icons/" + i.toString() + ".png"),
    iconSize: [38, 38] // size of the icon
  })
  customIconList.push(temp_item);
}

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(20, 20, true)
  });
};

export default function App() {
  const [locations, setLocations] = useState([]);
  const [labelArray, setLabelArray] = useState([4]);
  const postData = {
      "period": ["period_16_55"],
      "weekday": [1],
      // "district": ["quan_thu_duc"]
  }

  useEffect(() => {
    // Gửi yêu cầu lấy thông tin vị trí từ server FastAPI
    const get_locations = async () => {
      try {
        const res = await axios.post('http://localhost:8000/data_mining/K_means', postData)
        console.log("res", res.data[0])
        setLocations(res.data)
      }
      catch(error){
        console.error('Error fetching locations:', error)
      }
      
    }
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
    get_locations()
    
  }, []);
  console.log("locations: ", locations)
  return (
    <MapContainer center={[10.8231, 106.6297]} zoom={10}>
      {/* OPEN STREEN MAPS TILES */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* WATERCOLOR CUSTOM TILES */}
      {/* <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
      /> */}
      {/* GOOGLE MAPS TILES */}
      {/* <TileLayer
        attribution="Google Maps"
        // url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
        // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
        url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      /> */}

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {/* Mapping through the markers */}
        {locations.map((location_item) => (
        //   location_item.seg_info_list.map((marker) =>
        //   {
        //     // console.log("location_item", location_item.label === 6)
        //     if (location_item.label === 4){
        //       {console.log("makestart", marker)}
        //       {<Marker position={marker.position} icon={customIconList[location_item.label]}>
        //       <Popup>{location_item.label}</Popup>
        //     </Marker>}
        //   }
        //   else{}
        // }
        //   // <Marker position={marker.position} icon={customIconList[location_item.label]}>
        //   // <Popup>{location_item.label}</Popup>
        //   // </Marker>
        //   )
        location_item.seg_info_list.map((marker) => {
          if (labelArray.includes(location_item.label)) {
            return (
              <Marker position={marker.position} icon={customIconList[location_item.label]}>
                <Popup>{location_item.label}</Popup>
              </Marker>
            );
          } else {
            return null; // hoặc bạn có thể trả về phần tử rỗng <></> nếu bạn không muốn trả về null
          }
        })
        )
        )
        }

        {/* Hard coded markers */}
        {/* <Marker position={[51.505, -0.09]} icon={customIcon}>
          <Popup>This is popup 1</Popup>
        </Marker>
        <Marker position={[51.504, -0.1]} icon={customIcon}>
          <Popup>This is popup 2</Popup>
        </Marker>
        <Marker position={[51.5, -0.09]} icon={customIcon}>
          <Popup>This is popup 3</Popup>
        </Marker>
       */}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
