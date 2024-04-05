import { useCallback, useContext, useState } from "react";
import { MapContainer, FeatureGroup, Polyline, TileLayer } from "react-leaflet";
import EnhancedPolyline from "../Polyline/EnhancedPolyline";
import RouteContext from "../../store/routes-context";
import styles from './css/RTMap.module.css';

// i will probably use routes later as I will utilize other data with routes, meaning I will have to fetch the data
// center issue will be resolved 
function RTMap({routes}) {
  // const [routeData, setRouteData] = useState(routes);
  // const [center, setCenter] = useState(routes[0].points[0]);

  let center = [37.779352076644116, -122.38954362670768];

  console.log(routes);

  if (routes !== undefined && JSON.stringify(routes) !== '{}') {
    center = routes[0].points[0];
  }

  return (
    <>
      <MapContainer className={styles['leaflet-container']} center={center} zoom={13}>
        <TileLayer 
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <FeatureGroup>
        </FeatureGroup>
        {(routes !== undefined && JSON.stringify(routes) !== '{}') && routes.map(route => (
          <EnhancedPolyline key={route._id} positions={route.points} color="red"/>
            ))}
      </MapContainer>
    </>
  );
}

export default RTMap;