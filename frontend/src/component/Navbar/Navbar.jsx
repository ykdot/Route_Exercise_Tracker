import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import RouteTrackerContext from '../../store/route-tracker-contex';
import classes from './Navbar.module.css';

function Navbar() {
  const auth = useContext(RouteTrackerContext);
  const [ mobileList, setMobileList ] = useState(false);

  let mobileShow = '';
  // show list or not for mobile version
  if (mobileList) {
    mobileShow = 'show-list';
  }
  const handleRemoveMobileList = () => {
    if (mobileShow === 'show-list') {
      setMobileList(false)
    }
  };

  const handleLogOut = () => {
    auth.logout();
    handleRemoveMobileList();
  };

  return (
    <nav className={classes['main-nav']}>
      <h1 className={classes.title}>Route Exercise Tracker</h1>

      <button className={classes['link-icon']} onClick={() => setMobileList(!mobileList)}>
        <img className={classes.icon} src="/hamburger-icon.svg" alt="Hamburger Icon" />
      </button>
      
      <nav className={`${classes['link-nav']} ${classes[mobileShow]}`}>
        {!auth.isLoggedIn && <Link className={classes['link-button']} onClick={handleRemoveMobileList}>Home</Link>}
        {!auth.isLoggedIn && <Link to='/demo' className={classes['link-button']} onClick={handleRemoveMobileList}>Demo</Link>}
        {auth.isLoggedIn && <Link to={`/user-home`} className={classes['link-button']} onClick={handleRemoveMobileList}>User</Link>}
        {auth.isLoggedIn && <Link to='/user-routes' className={classes['link-button']} onClick={handleRemoveMobileList}>Routes</Link>}
        {!auth.isLoggedIn && <Link to='/login' className={classes['link-button']} onClick={handleRemoveMobileList}>Log In</Link>}
        {auth.isLoggedIn && <Link to={`/setting/${auth.username}`} className={classes['link-button']} onClick={handleRemoveMobileList}>Setting</Link>}
        {auth.isLoggedIn && <button className={classes['log-out-button']} onClick={handleLogOut}>Log Out</button>}
      </nav>
    </nav>
  );
}

export default Navbar; 