import RouteInfoBox from '../RouteInfoBox/RouteInfoBox';
import uuid from 'react-uuid';

import styles from './css/RouteInfo.module.css';

function RouteInfo({data}) {
  return (
    <div className={styles.container}>
        {data.map(data => (
          <RouteInfoBox key={uuid()} data={data}/>
            ))}      
    </div>
  );
}

export default RouteInfo;