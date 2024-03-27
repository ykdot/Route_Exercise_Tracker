import MapInfo from '../component/Map/MapInfo';
import styles from './css/DemoPage.module.css';
import demoData from '../store/demo-data';

function DemoPage() {
  // https://evernote.com/

  const values = demoData();

  const data =
  {
    "keys": [
        "WALKING",
        "RUNNING"
    ],
    "values": demoData()
}

  console.log(data);

  return (
    <div>
      <MapInfo routeTypes={data.keys} routeData={data.values}/>
    </div>
  );
}

export default DemoPage;