import { useEffect, useState } from "react";
import uuid from 'react-uuid';
import MapInfo from '../component/Map/MapInfo';
import RTMap from "../component/Map/RTMap";
import RouteInfo from "../component/Map/RouteInfo";
import HeatMap from "../component/Map/HeatMap";

import styles from './css/RoutePage.module.css';

function RoutePage() {
  const [routeTypes, setRouteTypes] = useState();
  const [routeType, setRouteType] = useState();
  const [routeData, setRouteData] = useState();
 

  const handleGetList = (newType) => {
    setRouteType(newType);        

    try {
      const response = async () => {
        const uid = JSON.parse(localStorage.getItem('userData')).userID;
        const data = await fetch(`http://localhost:5000/api/routes/get-user-routes/${uid}/${routeType}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },  
        });
        const responseData = await data.json();
        setRouteData(responseData.list);
      }
      response(); 
    }catch(err) {
      throw new Error(err);
    }
  };


  // fetch route
  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('userData')).userID;
    try {
      const response = async () => {
        // set up data
        const data = await fetch(`http://localhost:5000/api/users/get-user-routes/${uid}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        // proper user check needed later 
        const responseData = await data.json();

        const data2 = await fetch(`http://localhost:5000/api/routes/get-user-routes/${uid}/${responseData.types[0]}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },  
        });
        const responseData2 = await data2.json();

        // automatic batching
        setRouteTypes(responseData.types);
        setRouteType(responseData.types[0]);
        setRouteData(responseData2.list);
      }

      response();
    }catch(err) {
      throw new Error(err);
    }    
  }, []);

  console.log(routeData);
  return (
    <div className={styles['map-info']}>
      {routeTypes !== undefined &&
        <div className={styles['container-map']}>
        <select onChange={e => handleGetList(e.target.value)}>
          {routeTypes.map(type => (
            type === routeType ? (<option key={uuid()} value={type} defaultValue={routeType}>{type} </option>)
            : <option key={uuid()}>{type} </option>
          ))}
        </select> 
        <RTMap key={uuid()} routes={routeData}/>
      </div>
      }
      {routeTypes !== undefined && <RouteInfo className={styles['container-right']} data={routeData}/>}
    </div>
  );
}

export default RoutePage;