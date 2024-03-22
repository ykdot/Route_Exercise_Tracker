import { useState } from 'react';
import styles from './RouteInfoBox.module.css';

function RouteInfoBox({data}) {
  const [detailStatus, setDetailStatus] = useState(false);

  let detailBox;



  if (detailStatus) {
   detailBox = 'container';
  }
  else {
    detailBox = 'hidden';
  }

  const handleDelete = async() => {
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
        <p>Distance: {data.other.distance} Meters</p>
        <p>Time: {data.date}</p>
        <p>Duration: {data.other.duration}</p>
        <p>Heartbeat Data: </p>
        <p>Calories: {data.other.calories}</p>
        <button onClick={handleDelete}>Delete</button>
      </div>    
    </>

  );
}

export default RouteInfoBox;