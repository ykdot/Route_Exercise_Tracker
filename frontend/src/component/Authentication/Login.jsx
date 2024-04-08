
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './AuthenticationBox.module.css';
import { useContext, useState } from 'react';
import RouteTrackerContext from '../../store/route-tracker-contex';


function Login() {
  const auth = useContext(RouteTrackerContext);
  const [enteredAuthData, setAuthData] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const location = useLocation();


  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: enteredAuthData.username,
          password: enteredAuthData.password
        })        
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      auth.login(responseData.userID, responseData.username, responseData.email, responseData.token); 

      navigate(`/user-home`);     
    } catch(err) {
      setError(err.message || "Something went wrong!");
    }
  }

  function handleChangeUsername(event) {
    setAuthData((prevValue) => ({
      ...prevValue,
      username: event.target.value
    }));
  }

  function handleChangePassword(event) {
    setAuthData((prevValue) => ({
      ...prevValue,
      password: event.target.value
    }));
  }  

  const submitStatus = (enteredAuthData.username != "" && enteredAuthData.password != "") ? "eligible-button": "disabled"; 

  return (
    <form onSubmit={handleSubmit} className={styles['auth-box']}>
      <h1 className={styles.title}>Login</h1>
      {error != '' && <p className={styles['error-message']}>{error}</p>}
      <label className={styles['label-title']} htmlFor="">Username</label>
      <input className={styles['input-title']} value={enteredAuthData.username} onChange={handleChangeUsername} type='text' placeholder='Username'/> 
      <label className={styles['label-title']} htmlFor="">Password</label>
      <input className={styles['input-title']} value={enteredAuthData.password} onChange={handleChangePassword} type='password' placeholder='Password'/>   
      <input className={styles['submit-button']} type='submit' value='LOGIN'/> 
      <Link to='/signup' className={styles['alt-button']}>Sign up</Link>
    </form>
  );
}

export default Login;