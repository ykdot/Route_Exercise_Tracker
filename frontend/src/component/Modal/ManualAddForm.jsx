import { useContext, useState } from "react";
import { Circles } from "react-loader-spinner";
import RouteTrackerContext from "../../store/route-tracker-contex";
import styles from './css/ManualAddForm.module.css';

function ManualAddForm() {
  const auth = useContext(RouteTrackerContext);
  const [enteredData, setEnteredData] = useState({
    file: "",
    distance: "",
    time: "",
    duration: "",
    calories: ""
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(auth.userID);
    try {
      setIsLoading(true);
      // const response = await fetch('', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     uid: auth.userID,
      //     file: enteredData.file,
      //     distance: enteredData.distance,
      //     time: enteredData.time,
      //     duration: enteredData.duration,
      //     calories: enteredData.calories,
      //   })        
      // });

      // const responseData = await response.json();
      // if (!response.ok) {
      //   throw new Error(responseData.message);
      // }
      // console.log(responseData);      


      setIsLoading(false);
      window.location.reload(); 
    }catch(err) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);      
    }
  };

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
  return (
    <>
      {!isLoading &&
        <form onSubmit={handleSubmit} className={styles.container}>
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
      }

      {isLoading && 
        <div className={styles['loading-image']}>
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          />           
      </div>
      }
    </>

  );
}
export default ManualAddForm;