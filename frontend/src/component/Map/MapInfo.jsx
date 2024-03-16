import { useState } from "react";
import uuid from 'react-uuid';
import RTMap from "./RTMap";
import styles from './css/MapInfo.module.css';

function MapInfo({className, routeTypes, routeList}) {
  const [routeType, setRouteType] = useState(routeTypes[0]);
  return (
    <div className={styles.container}>
      <select onChange={e => setRouteType(e.target.value)}>
        {routeTypes.map(type => (
          <option key={uuid()} value={type}>{type}</option>
        ))}
      </select> 
      <RTMap key={uuid()} routes={routeList} routeType={routeType}/>
    </div>
  );
}

export default MapInfo;