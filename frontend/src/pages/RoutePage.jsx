import { useEffect, useState } from "react";
import MapInfo from '../component/Map/MapInfo';
import RouteInfo from "../component/Map/RouteInfo";
import HeatMap from "../component/Map/HeatMap";

import styles from './css/RoutePage.module.css';

function RoutePage() {
  const [routeTypes, setRouteTypes] = useState();
  const [routeList, setRouteList] = useState();


  // fetch route
  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('userData')).userID;
    try {
      const response = async () => {
        const data = await fetch(`http://localhost:5000/api/users/get-user-routes/${uid}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        // proper user check needed later 
        const responseData = await data.json();
        setRouteTypes(responseData.types);
        setRouteList(responseData.list);
      }

      response();
    }catch(err) {
      throw new Error(err);
    }    
  }, []);

  return (
    <div className={styles['map-info']}>
      {routeTypes !== undefined && <MapInfo className={styles['container-right']} routeTypes={routeTypes} routeList={routeList}/>}
      {routeTypes !== undefined && <RouteInfo className={styles['container-right']}/>}
    </div>
  );
}

export default RoutePage;