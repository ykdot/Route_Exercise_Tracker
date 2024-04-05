import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circles } from "react-loader-spinner";
import RouteTrackerContext from '../store/route-tracker-contex';
import styles from './css/SettingPage.module.css';

function SettingPage() {
  const auth = useContext(RouteTrackerContext);
  const navigate = useNavigate();

  const [deleteLoad, setDeleteLoad] = useState(false);

  if (deleteLoad === true) {
    const handleDeleteAccount = async() => {
      // prompt to ask user; model implementation in future

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
        console.log("This should be the time to redirect");
        navigate('/');
      }catch(err) {
        throw new Error(err);
      }
    }

    handleDeleteAccount();
  }

  return (
    <>
      {
        deleteLoad === false &&
        <div className={styles.container}>
          <div className={styles['inside-container']}>
            <h1>{auth.username}</h1>
            <p>Email: {auth.email}</p>
            <button className={styles['delete-button']} onClick={() => setDeleteLoad(true)}>Delete Account</button>
          </div>
        </div>        
      }
      {
        deleteLoad === true && 
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
    </>

  );
}

export default SettingPage;