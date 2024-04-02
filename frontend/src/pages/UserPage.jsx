import { useContext } from 'react';
import { Link } from 'react-router-dom';
import RouteTrackerContext from '../store/route-tracker-contex';
import styles from './css/UserPage.module.css';

function UserPage() {

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
          uid: JSON.parse(localStorage.getItem('userData')).userID,
          uri: 'http://localhost:5173/user-home'
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
  if (url !== `http://localhost:5173/user-home` && localStorage.getItem('apiSearch') === null && new URL(url).searchParams.get("code") !== null) {
    authenticatePolarUser();
  } 
  
  return (
    <div>
      <div>
        <h1>Welcome, {auth.username}</h1>
      </div>
      <div>
        {auth.apiID === null && <Link to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc&redirect_uri=http://localhost:5173/user-home'>Authentication</Link>}
        {auth.apiID !== null && <button onClick={getData}>get user data</button>}            
      </div>

    </div>
  );
}

export default UserPage;