import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import RouteTrackerContext from '../../store/route-tracker-contex';
import classes from './Navbar.module.css';

function Navbar() {
  const auth = useContext(RouteTrackerContext);
  const [ mobileList, setMobileList ] = useState(false);



  let mobileShow;
  // show list or not for mobile version
  if (mobileList) {
    mobileShow = 'show-list';
  }

  return (
    <nav className={classes['main-nav']}>
      <h1 className={classes.title}>Route Tracker</h1>

      <button className={classes['link-icon']} onClick={() => setMobileList(!mobileList)}>
        <img className={classes.icon} src="/hamburger-icon.svg" alt="Hamburger Icon" />
      </button>
      <nav className={`${classes['link-nav']} ${classes[mobileShow]}`}>
        <Link className={classes['link-button']}>Home</Link>
        <Link className={classes['link-button']}>Routes</Link>
        {!auth.isLoggedIn && <Link to='/login' className={classes['link-button']}>Log In</Link>}
        {auth.isLoggedIn && <button className={classes['link-button']} onClick={auth.logout}>Log Out</button>}
        {auth.isLoggedIn && <Link className={classes['link-button']}>{auth.username}</Link>}
      </nav>
    </nav>
  );
}

export default Navbar; 