import RouteInfoBox from '../RouteInfoBox/RouteInfoBox';
import uuid from 'react-uuid';

import styles from './css/RouteInfo.module.css';

function RouteInfo({data, state}) {
  return (
    <div className={styles.container}>
      <div className={styles['container-header']}>
        Routes
      </div>
      {(data !== undefined && JSON.stringify(data) !== '{}') && data.map(data => (
        <RouteInfoBox key={uuid()} data={data} state={state}/>
          ))}      
    </div>
  );
}

export default RouteInfo;