import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';

function Navbar() {
  
  return (
    <nav className={classes['main-nav']}>
      <h1>Route Tracker</h1>

      <nav className={classes['link-nav']}>
        <Link className={classes['link-button']}>Home</Link>
        <Link className={classes['link-button']}>Routes</Link>
      </nav>
    </nav>
  );
}

export default Navbar; 