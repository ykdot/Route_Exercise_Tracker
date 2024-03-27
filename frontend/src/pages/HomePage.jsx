import { Link, redirect } from "react-router-dom";
import { useContext } from "react";
import styles from './css/HomePage.module.css';

import RouteTrackerContext from "../store/route-tracker-contex";

function HomePage() {
  const auth = useContext(RouteTrackerContext);

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
          uid: JSON.parse(localStorage.getItem('userData')).userID
        })  
      }); 

      // proper user check needed later 
      const responseData = await data.json();
      console.log(responseData); 
      auth.apiLogin(responseData.token, responseData.apiID);
      // localStorage.setItem(
      //   'apiToken', 
      //   JSON.stringify({ apiID: responseData.apiID, token: responseData.token }));
      
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
  if (url !== 'http://localhost:5173/' && localStorage.getItem('apiSearch') === null) {
    authenticatePolarUser();
  } 

  function redirectToPolar() {
    redirect('https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc');
    }

  return (
    <>
      {auth.isLoggedIn && <Link to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc'>Authentication</Link>}
      {auth.isLoggedIn && <button onClick={getData}>get user data</button>}

      {!auth.isLoggedIn &&
      <div className={styles['info-container']}>
        <div className={styles['first-section']}>
          <div className={styles['first-left']}>
            <h1>Track Routes and Pathes</h1>
            <p className={styles['first-desc']}>With Route Tracker, you can track all running, walking, hiking routes and pathes by 
              visualizing each route on a map.
            </p>  
            <Link to='/signup' className={styles['first-link']}>Start Tracking Routes Today!</Link>
          </div>
          <img className={styles['first-right']} src="./../../../title-map.png" alt="Route Map" />
        </div>
        <div className={styles['second-section']}>
          <li className={styles['second-benefit-section']}>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../route-solid.svg" alt="route" />
              <p className={styles['second-head-text']}>Visualize Routes</p>
              <p className={styles['second-desc-text']}>Keep routes in one place where you can view the precise route you&apos;ve taken</p>
            </ul>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../magnifying-glass-solid.svg" alt="magnifying glass" />
              <p className={styles['second-head-text']}>Get More Insights</p>
              <p className={styles['second-desc-text']}>See how far and how easy/hard a route you ran compared to other ones</p>
            </ul>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../plus-solid.svg" alt="plus" />
              <p className={styles['second-head-text']}>Store/Add Additional Details</p>
              <p className={styles['second-desc-text']}>Store additional informations like calories, time duration, start of time, etc to paint a better picture</p>
            </ul>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../gamepad-solid.svg" alt="gamepad" />
              <p className={styles['second-head-text']}>&quot;Gamify Routes&quot;</p>
              <p className={styles['second-desc-text']}>See where you haven&apos;t explored and work to diversify your area of exercise</p>
            </ul>
          </li>
        </div>
      </div>
      }
    </>
  );
}

export default HomePage;