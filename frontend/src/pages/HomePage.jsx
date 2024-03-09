import { Link, redirect } from "react-router-dom";
import { useContext } from "react";

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
          code: code
        })  
      }); 

      // proper user check needed later 
      const responseData = await data.json();
      console.log(responseData); 
      localStorage.setItem(
        'apiToken', 
        JSON.stringify({ token: responseData.token }));
      
    }catch(err) {
      throw new Error(err);
    }    
  }

  if (url !== 'http://localhost:5173/' && localStorage.getItem('apiSearch') === null) {
    authenticatePolarUser();
  } 

  function redirectToPolar() {
    redirect('https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc');
    }

  return (
    <>
      {auth.isLoggedIn && <Link to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc'>Authentication</Link>}
    </>
  );
}

export default HomePage;