import { useState } from 'react';
import styles from './RouteInfoBox.module.css';

function RouteInfoBox({route}) {
  const [detailStatus, setDetailStatus] = useState(false);

  let detailBox;



  if (detailStatus) {
   detailBox = 'container';
  }
  else {
    detailBox = 'hidden';
  }

  return (
    <>
      <button className={styles['button-container']} onClick={() => setDetailStatus(!detailStatus)}>
        <p>Running</p>
        <p>4/16</p>
        <p>18:06</p>
      </button>
      <div className={styles[detailBox]}>
        <p>Type: </p>
        <p>Distance: {"10KM"}</p>
        <p>Time: {"18:00"}</p>
        <p>Duration: {}</p>
        <p>Heartbeat Data: </p>
        <p>Calories: </p>
        <p>Delete</p>
      </div>    
    </>

  );
}

export default RouteInfoBox;