import styles from './css/RoutePage.module.css';
import 'leaflet/dist/leaflet.css';

import { useState } from "react";
import Map from '../component/Map/Map.jsx';

function RoutePage() {
  const [routeType, setRouteType] = useState('running');

  return (
    <div className={styles.container}>
      <select value={routeType} onChange={e => setRouteType(e.target.value)}>
        <option value="walking">Walking</option>
        <option value="running">Running</option>
        <option value="driving">Driving</option>
      </select> 
      <Map />
    </div>
  );
}

export default RoutePage;