import RouteInfoBox from '../RouteInfoBox/RouteInfoBox';
import uuid from 'react-uuid';

import styles from './css/RouteInfo.module.css';

// this component shows the list of routes on the right side of the route/demo page
function RouteInfo({data, state}) {
  return (
    <div className={styles.container}>
      <p className={styles['container-header']}>
        Routes
      </p>
      <div className={styles['route-list']}>
        {(data !== undefined && JSON.stringify(data) !== '{}') && data.map(data => (
          <RouteInfoBox key={uuid()} data={data} state={state}/>
            ))}          
      </div>
    </div>
  );
}

export default RouteInfo;