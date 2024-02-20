
import { Link } from 'react-router-dom';
import styles from './AuthenticationBox.module.css';


function Login() {

  return (
    <form className={styles['auth-box']}>
      <h1 className={styles.title}>Login</h1>
      <label className={styles['label-title']} htmlFor="">Username</label>
      <input className={styles['input-title']} type='text' placeholder='Username'/> 
      <label className={styles['label-title']} htmlFor="">Password</label>
      <input className={styles['input-title']} type='password' placeholder='Password'/>   
      <input className={styles['submit-button']} type='submit' value='LOGIN'/> 
      <Link to='/signup' className={styles['alt-button']}>Sign up</Link>

    </form>
  );
}

export default Login;