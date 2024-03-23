import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import RouteTrackerContext from '../store/route-tracker-contex';
import styles from './css/UserPage.module.css';
import { redirect } from 'react-router-dom';

function UserPage() {
  const auth = useContext(RouteTrackerContext);
  const navigate = useNavigate();

  const handleDeleteAccount = async() => {
    // prompt to ask user

    const userID = JSON.parse(localStorage.getItem('userData')).userID;
    const apiID = JSON.parse(localStorage.getItem('apiToken')).apiID;
    const token = JSON.parse(localStorage.getItem('apiToken')).token;



    // if polar authenticated, go ahead and delete or if no polar connection, go ahead and delete
    try {
      const response = await fetch(`http://localhost:5000/api/users/delete-account/${userID}/${apiID}/${token}`, 
        {
          method: 'DELETE',
          // headers: {
          //   'Authorization': `Bearer ${auth.token}` ,
          // },
        });
      
      await response.json();
      auth.logout();
      localStorage.clear();
      navigate('/');
    }catch(err) {
      throw new Error(err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles['inside-container']}>
        <h1>{auth.username}</h1>

        <p>Email: {auth.email}</p>

        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
}

export default UserPage;