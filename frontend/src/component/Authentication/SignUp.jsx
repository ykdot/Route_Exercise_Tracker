import { Link } from 'react-router-dom';
import styles from'./AuthenticationBox.module.css';
function SignUp() {

  return (
    <form className={styles['auth-box']}>
      <h1 className={styles.title}>Login</h1>
      <label className={styles['label-title']} htmlFor="">Email</label>
      <input className={styles['input-title']} type='email' placeholder='Email'/> 
      <label className={styles['label-title']} htmlFor="">Username</label>
      <input className={styles['input-title']} type='text' placeholder='Username'/> 
      <label className={styles['label-title']} htmlFor="">Password</label>
      <input className={styles['input-title']} type='password' placeholder='Password'/>   
      <label className={styles['label-title']} htmlFor="">Re-enter Password</label>
      <input className={styles['input-title']} type='password' placeholder='Password'/>     
      <input className={styles['submit-button']} type='submit' value='SIGN UP'/> 
      <Link to='/login' className={styles['alt-button']}>Login</Link>
    </form>
  );
}

export default SignUp;