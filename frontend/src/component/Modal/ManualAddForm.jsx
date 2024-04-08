import { useState } from "react";
import styles from './css/ManualAddForm.module.css';

function ManualAddForm() {
  const [enteredData, setEnteredData] = useState({
    file: "",
    distance: "",
    time: "",
    duration: "",
    calories: ""
  });

  const [error, setError] = useState('');

  function handleChangeFile(event) {
    console
    setEnteredData((prevValue) => ({
      ...prevValue,
      file: event.target.value
    }));
  }

  function handleChangeDistance(event) {
    console
    setEnteredData((prevValue) => ({
      ...prevValue,
      distance: event.target.value
    }));
  }

  function handleChangeTime(event) {
    console
    setEnteredData((prevValue) => ({
      ...prevValue,
      time: event.target.value
    }));
  }
  function handleChangeDuration(event) {
    console
    setEnteredData((prevValue) => ({
      ...prevValue,
      duration: event.target.value
    }));
  }
  function handleChangeCalories(event) {
    console
    setEnteredData((prevValue) => ({
      ...prevValue,
      calories: event.target.value
    }));
  }
  
  const submitStatus = (enteredData.file !== "")? "eligible-button" : "disabled" ;

  console.log(enteredData);

  return (
    <form action="" className={styles.container}>
      <h1>Add a Route</h1>
      {error != '' && <p className={styles['error-message']}>{error}</p>}
      <label htmlFor="">GPX File:</label>
      <input type="file" accept=".gpx" onChange={handleChangeFile}/>      
      <label htmlFor="">Distance: </label>
      <input type="text" value={enteredData.distance} onChange={handleChangeDistance} placeholder=''/>
      <label htmlFor="">Time: </label>
      <input type="text" value={enteredData.time} onChange={handleChangeTime} placeholder=''/>
      <label htmlFor="">Duration: </label>
      <input type="text" value={enteredData.duration} onChange={handleChangeDuration} placeholder=''/>
      <label htmlFor="">Calories: </label>
      <input type="text" value={enteredData.calories} onChange={handleChangeCalories} placeholder=''/>
      
      <input className={`${styles["submit-button"]} ${styles[submitStatus]}`} type="submit" value="Add Route" />
    </form>
  );
}

export default ManualAddForm;