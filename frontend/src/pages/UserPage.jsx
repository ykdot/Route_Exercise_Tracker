import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import { Circles } from 'react-loader-spinner';
import { Helmet} from 'react-helmet';
import RouteTrackerContext from '../store/route-tracker-contex';
import styles from './css/UserPage.module.css';

function UserPage() {
  const auth = useContext(RouteTrackerContext);
  const [userInfo, setUserInfo] = useState(null);
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
          uri: 'http://localhost:5173/user-home'
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

  const getData = async() => {
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
      const responseData = await data.json();
      console.log(responseData);
    }catch(err) {
      throw new Error(err);
    }
  }

  // potential loopholes
  if (url !== `http://localhost:5173/user-home` && localStorage.getItem('apiSearch') === null && new URL(url).searchParams.get("code") !== null) {
    authenticatePolarUser();
  } 

  useEffect(() => {
    try {
      const response = async() => {
        const data = await fetch(`http://localhost:5000/api/users/get-general-user-info/${JSON.parse(localStorage.getItem('userData')).userID}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }); 
        const responseData = await data.json();
        setUserInfo(responseData);     
      };
      response();
    }catch(err) {
      throw new Error(err);
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <Helmet>
        <title>User Page</title>
      </Helmet>
      <div className={styles['user-container']}>
        <h1>Welcome, {auth.username}</h1>
      </div>
      <div className={styles['addition-container']}>
        {auth.apiID === null && <Link className={styles['addition-card']} to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc&redirect_uri=http://localhost:5173/user-home'>Authentication</Link>}
        {auth.apiID !== null && <button className={styles['addition-card']} onClick={getData}>Get Polar User Data</button>}   
        <button className={styles['addition-card']}>Manual Add</button>         
      </div>

      {
        userInfo === null &&
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          />
      }

      {
        userInfo !== null &&
        <>
          {
            userInfo.info.length === 0 &&
            <div className={styles['no-routes']}>
              <h1>Add Some Route to Get Started</h1>
            </div>
          }

          {
            userInfo.info.length !== 0 &&
            userInfo.info.map(type => (
              <div key={uuid()} className={styles['info-card']}>
                <h1>{type.key}</h1>
                <p>Total Routes: {type.routes}</p>
                <p>Total Distance: {type.distance} Meters</p>
                <p>Longest Individual Route: {type.longest.distance} Meters</p>
              </div>
            ))
          }
        </>
      }
    </div>
  );
}

export default UserPage;