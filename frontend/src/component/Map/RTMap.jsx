import { useEffect, useState } from "react";
import { MapContainer, FeatureGroup, Polyline, TileLayer } from "react-leaflet";
import styles from './css/RTMap.module.css';

// i will probably use routes later as I will utilize other data with routes, meaning I will have to fetch the data
// center issue will be resolved 
function RTMap({routes, routeType}) {
  const [routeData, setRouteData] = useState(routes);
  const [center, setCenter] = useState(routes[0].points[0]);

  // useEffect(() => {
  //   try {
  //     const response = async () => {
  //       const uid = JSON.parse(localStorage.getItem('userData')).userID;
  //       const data = await fetch(`http://localhost:5000/api/routes/get-user-routes/${uid}/${routeType}`, 
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },  
  //       });
  //       const responseData = await data.json();
  //       setRouteData(responseData.list);
  //     }
  //     response(); 
  //   }catch(err) {
  //     throw new Error(err);
  //   }
  // }, []);
  return (
    <>
    { routeData !== undefined &&    
      <MapContainer className={styles['leaflet-container']} center={center} zoom={13}>
        <TileLayer 
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <FeatureGroup>
        </FeatureGroup>
        {routeData.map(route => (
          <Polyline key={route._id} positions={route.points} color="red"/>
            ))}
      </MapContainer>
    }
    </>
  );
}

export default RTMap;