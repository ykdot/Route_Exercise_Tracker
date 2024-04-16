import { useState } from 'react';
import styles from './RouteInfoBox.module.css';

function RouteInfoBox({data, state}) {
  const [detailStatus, setDetailStatus] = useState(false);

  let detailBox;
  
  if (detailStatus) {
   detailBox = 'container';
  }
  else {
    detailBox = 'hidden';
  }

  const handleDelete = async() => {
    if (state === true) {
      try {
        const response = await fetch(`http://localhost:5000/api/routes/delete-route/${data._id}`, 
          {
            method: 'DELETE',
          });
        await response.json();
        window.location.reload();
      }catch(err) {
        throw Error(err);
      }      
    }
  };

  return (
    <>
      <button className={styles['button-container']} onClick={() => setDetailStatus(!detailStatus)}>
        <p>{data.type}</p>
        <p>{data.date}</p>
        <p>{data.date}</p>
      </button>
      <div className={styles[detailBox]}>
        <p>Type: {data.type}</p>
        <p>Distance: {data.distance /1000} KM</p>
        <p>Time: {data.date}</p>
        <p>Duration: {data.duration.slice(2)}</p>
        <p>Heartbeat Data: </p>
        <p>Calories: {data.calories}</p>
        <button onClick={handleDelete} className={styles['delete-button']}>Delete</button>
      </div>    
    </>
  );
}

export default RouteInfoBox;