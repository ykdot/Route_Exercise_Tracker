import { Link } from "react-router-dom";
import styles from './css/HomePage.module.css';

function HomePage() {
  return (
    <>
      <div className={styles['info-container']}>
        <div className={styles['first-section']}>
          <div className={styles['first-left']}>
            <h1>Track Routes and Pathes</h1>
            <p className={styles['first-desc']}>With Route Tracker, you can track all running, walking, hiking routes and pathes by 
              visualizing each route on a map.
            </p>  
            <Link to='/signup' className={styles['first-link']}>Start Tracking Routes Today!</Link>
          </div>
          <img className={styles['first-right']} src="./../../../title-map.png" alt="Route Map" />
        </div>
        <div className={styles['second-section']}>
          <li className={styles['second-benefit-section']}>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../route-solid.svg" alt="route" />
              <p className={styles['second-head-text']}>Visualize Routes</p>
              <p className={styles['second-desc-text']}>Keep routes in one place where you can view the precise route you&apos;ve taken</p>
            </ul>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../magnifying-glass-solid.svg" alt="magnifying glass" />
              <p className={styles['second-head-text']}>Get More Insights</p>
              <p className={styles['second-desc-text']}>See how far and how easy/hard a route you ran compared to other ones</p>
            </ul>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../plus-solid.svg" alt="plus" />
              <p className={styles['second-head-text']}>Store/Add Additional Details</p>
              <p className={styles['second-desc-text']}>Store additional informations like calories, time duration, start of time, etc to paint a better picture</p>
            </ul>
            <ul className={styles['second-info-box']}>
              <img className={styles['second-img']} src="./../../../gamepad-solid.svg" alt="gamepad" />
              <p className={styles['second-head-text']}>&quot;Gamify Routes&quot;</p>
              <p className={styles['second-desc-text']}>See where you haven&apos;t explored and work to diversify your area of exercise</p>
            </ul>
          </li>
        </div>
        <div className={styles['third-section']}>
          <h4>Use your Polar Account</h4>
          <p>You can transfer all routes recorded by Polar to Route Tracker. In addition to the routes transfered, other data such as calories and route distance would automatically be shown.</p>
        </div>

        <div className={styles.footer}>
          <p>Email: TBA</p>
          <Link className={styles['outside-link']} to='https://github.com/ykdot/Route_Tracker' target="_blank">Github</Link>
          <Link className={styles['outside-link']} to='https://flow.polar.com/' target="_blank">Polar Flow</Link>
        </div>
      </div>
    </>
  );
}

export default HomePage;