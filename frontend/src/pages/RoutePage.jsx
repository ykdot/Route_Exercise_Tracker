import styles from './css/RoutePage.module.css';
import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from "react";
import { MapContainer, FeatureGroup, Polyline, TileLayer } from "react-leaflet";

function RoutePage() {

  const [routeType, setRouteType] = useState('running');
  const [routeData, setRouteData] = useState([]);

  useEffect(() => {
    try {
      const response = async () => {
        const data = await fetch(`http://localhost:5000/api/users/get-route`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },  
        });

        // proper user check needed later 
        const responseData = await data.json();
        setRouteData(responseData.coordinates);
      }
      response(); 
    }catch(err) {
      throw new Error(err);
    }
  }, [])

  console.log(routeData);
  const pos = [
    [36.460353, 126.440674],
    [34.789594, 135.438084], //to jpn
    [36.460353, 126.440674],
    [55.410343, 37.902312], //to rus
    [36.460353, 126.440674],
    [40.085148, 116.552407] //to chi
  ];

  const pos2 = [
    [
      33.64621667,
      -117.825755
  ],
  [
      33.6462,
      -117.82575
  ],
  [
      33.6462,
      -117.82574333
  ],
  [
      33.64611333,
      -117.82559333
  ],
  [
      33.64606167,
      -117.82551167
  ],
  [
      33.64603667,
      -117.82546667
  ],
  ]
  return (
    <div className={styles.container}>
      <select value={routeType} onChange={e => setRouteType(e.target.value)}>
        <option value="walking">Walking</option>
        <option value="running">Running</option>
        <option value="driving">Driving</option>
      </select> 
      <MapContainer className={styles['leaflet-container']} center={[37.67, -122.07]} zoom={13}>
        <TileLayer 
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <FeatureGroup>
          <Polyline positions={routeData} color="red"/>
        </FeatureGroup>
      </MapContainer>
      
    </div>
  );
}

export default RoutePage;