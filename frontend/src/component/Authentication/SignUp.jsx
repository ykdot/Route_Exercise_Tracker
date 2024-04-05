import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RouteTrackerContext from '../../store/route-tracker-contex';
import styles from'./AuthenticationBox.module.css';

function SignUp() {
  const auth = useContext(RouteTrackerContext);

  const [enteredNewUser, setNewUserData] = useState({
    email: "",
    username: "",
    password: "",
    rePassword: ""
  });

  const navigate = useNavigate();

  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/create",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: enteredNewUser.email,
          username: enteredNewUser.username,
          password: enteredNewUser.password
        })        
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      auth.login(responseData.userID, responseData.username, responseData.email, responseData.token);
      navigate('/user-home');
      // window.location.reload(); 
    } catch(err) {
      setError(err.message || "Something went wrong");
    }
  }

  function handleChangeEmail(event) {
    setNewUserData((prevValue) => ({
      ...prevValue,
      email: event.target.value
    }));
  }  

  function handleChangeUsername(event) {
    setNewUserData((prevValue) => ({
      ...prevValue,
      username: event.target.value
    }));
  }

  function handleChangePassword(event) {
    setNewUserData((prevValue) => ({
      ...prevValue,
      password: event.target.value
    }));
  }  

  function handleChangeRePassword(event) {
    setNewUserData((prevValue) => ({
      ...prevValue,
      rePassword: event.target.value
    }));
  }   

  return (
    <form onSubmit={handleSubmit} className={styles['auth-box-signup']}>
      <h1 className={styles.title}>Sign Up</h1>
      {error != '' && <p className={styles['error-message']}>{error}</p>}
      <label className={styles['label-title']} htmlFor="">Email</label>
      <input className={styles['input-title']} value={enteredNewUser.email} onChange={handleChangeEmail} type='email' placeholder='Email'/> 
      <label className={styles['label-title']} htmlFor="">Username</label>
      <input className={styles['input-title']} value={enteredNewUser.username} onChange={handleChangeUsername} type='text' placeholder='Username'/> 
      <label className={styles['label-title']} htmlFor="">Password</label>
      <input className={styles['input-title']} value={enteredNewUser.password} onChange={handleChangePassword} type='password' placeholder='Password'/>   
      <label className={styles['label-title']} htmlFor="">Re-enter Password</label>
      <input className={styles['input-title']} value={enteredNewUser.rePassword} onChange={handleChangeRePassword} type='password' placeholder='Password'/>     
      <input className={styles['submit-button']} type='submit' value='SIGN UP'/> 
      <Link to='/login' className={styles['alt-button']}>Login</Link>
    </form>
  );
}

export default SignUp;