import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RouteTrackerContext from '../../store/route-tracker-contex';
import classes from './Navbar.module.css';

function Navbar() {
  const auth = useContext(RouteTrackerContext);
  const [ mobileList, setMobileList ] = useState(false);
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   auth.logout();
  //   // navigate('/');
  // }

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
        {!auth.isLoggedIn && <Link className={classes['link-button']}>Home</Link>}
        {!auth.isLoggedIn && <Link to='/demo' className={classes['link-button']}>Demo</Link>}
        {/* {!auth.isLoggedIn && <Link to='/about' className={classes['link-button']}>About</Link>} */}
        {auth.isLoggedIn && <Link to={`/user-home`} className={classes['link-button']}>User</Link>}
        {auth.isLoggedIn && <Link to='/user-routes' className={classes['link-button']}>Routes</Link>}
        {!auth.isLoggedIn && <Link to='/login' className={classes['link-button']}>Log In</Link>}
        {auth.isLoggedIn && <Link to={`/setting/${auth.username}`} className={classes['link-button']}>Setting</Link>}
        {auth.isLoggedIn && <button className={classes['log-out-button']} onClick={auth.logout}>Log Out</button>}
      </nav>
    </nav>
  );
}

export default Navbar; 