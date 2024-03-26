import { useState } from "react";
import uuid from 'react-uuid';
import RTMap from "./RTMap";
import RouteInfo from "./RouteInfo";
import styles from './css/MapInfo.module.css';

function MapInfo({routeType, routeData}) {
  const [routeType, setRouteType] = useState(routeTypes[0]);
  return (
    <div className={styles['map-info']}>
      {routeTypes !== undefined &&
        <div className={styles['container-map']}>
          <div className={styles['container-header']}>
            <select value={routeType} className={styles['container-select']}onChange={e => handleGetList(e.target.value)}>
              {routeTypes.map(type => (
                type === routeType ? (<option key={uuid()} value={type} defaultValue={routeType}>{type} </option>)
                : <option key={uuid()}>{type} </option>
              ))}
            </select>  
            {!auth.isPolarAuthenticated && <button>Polar Authenticate</button>}   
            {auth.isPolarAuthenticated && <button className={styles['container-button']} onClick={getNewData}>Update via Polar</button>}
            <button className={styles['container-button']}>Manual Add</button>     
          </div>
          <RTMap key={uuid()} routes={routeData}/>
      </div>
      }
      {routeType !== undefined && <RouteInfo className={styles['container-right']} data={routeData}/>}
    </div>
  );
}

export default MapInfo;