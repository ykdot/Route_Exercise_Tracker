import { useEffect, useState } from "react";
import { MapContainer, FeatureGroup, Polyline, TileLayer } from "react-leaflet";
import styles from './Map.module.css';

function Map() {
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
  }, []);

  return (
    <MapContainer className={styles['leaflet-container']} center={[37.67, -122.07]} zoom={13}>
    <TileLayer 
      attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
    <FeatureGroup>
      <Polyline positions={routeData} color="red"/>
    </FeatureGroup>
  </MapContainer>
  );
}

export default Map;