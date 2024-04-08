import { MapContainer, FeatureGroup, TileLayer } from "react-leaflet";
import EnhancedPolyline from "../Polyline/EnhancedPolyline";
import styles from './css/RTMap.module.css';

function RTMap({routes}) {
  let center = [37.779352076644116, -122.38954362670768];

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
          <EnhancedPolyline key={route._id} positions={route.points} popup={route} color="red"/>
            ))}
      </MapContainer>
    </>
  );
}

export default RTMap;