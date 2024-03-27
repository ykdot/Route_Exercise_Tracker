import { useState } from "react";
import uuid from 'react-uuid';
import RTMap from "./RTMap";
import RouteInfo from "./RouteInfo";
import styles from './css/MapInfo.module.css';

function MapInfo({routeTypes, routeData}) {
  const [routeType, setRouteType] = useState(routeTypes[0]);
  console.log(routeData[routeType]);
  return (
    <div className={styles['map-info']}>
      <div className={styles['container-map']}>
        <div className={styles['container-header']}>
          <select value={routeType} className={styles['container-select']}onChange={e => setRouteType(e.target.value)}>
            {routeTypes.map(type => (
              type === routeTypes ? (<option key={uuid()} value={type} defaultValue={routeTypes}>{type} </option>)
              : <option key={uuid()}>{type} </option>
            ))}
          </select>  
          <button>Polar Authenticate</button>
          <button className={styles['container-button']}>Update via Polar</button>
          <button className={styles['container-button']}>Manual Add</button>     
        </div>
        <RTMap key={uuid()} routes={routeData[routeType]}/>
      </div>
      
      <RouteInfo className={styles['container-right']} data={routeData[routeType]}/>
    </div>
  );
}

export default MapInfo;