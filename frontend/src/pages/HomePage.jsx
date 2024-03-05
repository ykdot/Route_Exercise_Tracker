import { Link, redirect } from "react-router-dom";
import { useContext, useEffect } from "react";

import RouteTrackerContext from "../store/route-tracker-contex";

function HomePage() {
  const auth = useContext(RouteTrackerContext);

  const url = window.location.href;

  const authenticatePolarUser = async () => {
    const code = new URL(url).searchParams.get("code"); 
    console.log(code);    
    try {
      const response = async () => {
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
        // setRouteData(responseData.coordinates);  
      }
      response();
    }catch(err) {
      throw new Error(err);
    }    
  }
  
  if (url !== 'http://localhost:5173/' && !auth.api) {
    authenticatePolarUser();
    auth.api = true; 
  } 

  function redirectToPolar() {
    redirect('https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc');
    }

  return (
    <Link to='https://flow.polar.com/oauth2/authorization?response_type=code&client_id=08ae0351-2e51-4723-a705-fbadd45aa5fc'>Authentication</Link>
  );
}

export default HomePage;