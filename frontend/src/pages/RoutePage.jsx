import { useEffect, useState } from "react";
import MapInfo from '../component/Map/MapInfo';

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
    <>
      {routeTypes !== undefined && <MapInfo routeTypes={routeTypes} routeList={routeList}/>}
    </>
  );
}

export default RoutePage;