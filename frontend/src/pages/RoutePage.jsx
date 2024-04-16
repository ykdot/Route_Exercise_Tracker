import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uuid from 'react-uuid';
import { Circles } from "react-loader-spinner";
import { Helmet} from 'react-helmet';
import RTMap from "../component/Map/RTMap";
import RouteInfo from "../component/Map/RouteInfo";
import RouteTrackerContext from "../store/route-tracker-contex";
import Modal from "../component/Modal/Modal";
import ManualAddForm from "../component/Modal/ManualAddForm";
import styles from './css/RoutePage.module.css';

function RoutePage() {
  const auth = useContext(RouteTrackerContext);
  const [routeTypes, setRouteTypes] = useState();
  const [routeType, setRouteType] = useState();
  const [routeData, setRouteData] = useState(null);
  const dialog = useRef();
  
  
  const handleShowManualForm = () => {
    dialog.current.showModal();
  } 

  const navigate = useNavigate();
  if (!auth.isLoggedIn) {
    navigate('/');
  }
 
  const handleGetList = (newType) => {
    try {
      const response = async () => {
        const uid = JSON.parse(localStorage.getItem('userData')).userID;
        const data = await fetch(`http://localhost:5000/api/routes/get-user-routes/${uid}/${newType}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },  
        });
        const responseData = await data.json();
        // setRouteType(newType);        
        setRouteData(responseData.list);
      }
      response(); 
    }catch(err) {
      throw new Error(err);
    }
  };

  const getNewData = async() => {
    try {
      const data = await fetch(`http://localhost:5000/api/users/get-new-data`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: JSON.parse(localStorage.getItem('apiToken')).token,
          uid: JSON.parse(localStorage.getItem('userData')).userID
        }) 
      }); 

      // proper user check needed later 
      const responseData = await data.status;
      console.log(responseData);
      window.location.reload(); 
    }catch(err) {
      throw new Error(err);
    }
  }

  const url = window.location.href;

  const authenticatePolarUser = async () => {
    const code = new URL(url).searchParams.get("code"); 
    try {
      localStorage.setItem(
        'apiSearch', 
        JSON.stringify({ value: true }));
      const data = await fetch(`http://localhost:5000/api/users/connect-api`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          uid: JSON.parse(localStorage.getItem('userData')).userID,
          uri: 'http://localhost:5173/user-routes'
        })  
      }); 

      // proper user check needed later 
      const responseData = await data.json();
      console.log(responseData); 
      auth.apiLogin(responseData.token, responseData.apiID);     
    }catch(err) {
      throw new Error(err);
    }    
  }

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

        if (responseData.types[0] !== undefined) {
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
        else {
          console.log(responseData);
          setRouteTypes(responseData.types);
          setRouteType(responseData.types[0]);
          setRouteData(responseData.list);          
        }
      }

      response();
    }catch(err) {
      throw new Error(err);
    }    
  }, []);

  // potential loopholes
  if (url !== 'http://localhost:5173/user-routes' && localStorage.getItem('apiSearch') === null) {
    authenticatePolarUser();
  } 
  return (
    <>
    <Modal ref={dialog}>
      <ManualAddForm />
    </Modal>
    <Helmet>
      <title>Route Page</title>
    </Helmet>
      {
        routeData === null && 
        <div className={styles['loading-image']}>
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            />           
        </div>
      }
      {
        routeData !== null && 
        <div className={styles['map-info']}>
          {routeTypes !== undefined &&
            <div className={styles['container-map']}>
              <div className={styles['container-header']}>
                { JSON.stringify(routeData) !== '{}' && 
                  <select value={routeData[0].type} className={styles['container-select']} onChange={e => handleGetList(e.target.value)}>
                    {routeTypes.map(type => (
                      type === routeType ? (<option key={uuid()} value={type} >{type} </option>)
                      : <option key={uuid()}>{type} </option>
                    ))}
                  </select> 
                }

                { JSON.stringify(routeData) === '{}' && 
                  <select className={styles['container-select']} ></select> 
                }

                {!auth.isPolarAuthenticated && <Link className={styles['auth-link']} to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc&redirect_uri=http://localhost:5173/user-routes'>Authentication</Link>}   
                {auth.isPolarAuthenticated && <button className={styles['container-buttons']} onClick={getNewData}>Update via Polar</button>}
                <button className={styles['container-buttons']} onClick={handleShowManualForm}>Manual Add</button>     
              </div>
              <RTMap key={uuid()} routes={routeData}/>
          </div>
          }
          {routeTypes !== undefined && <RouteInfo className={styles['container-right']} data={routeData}/>}
        </div>        
      }
    </>
  );
}

export default RoutePage;