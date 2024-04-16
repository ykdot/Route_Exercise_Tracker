import { Helmet} from 'react-helmet';
import MapInfo from '../component/Map/MapInfo';
import demoData from '../store/demo-data';

function DemoPage() {
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
      <Helmet>
        <title>Demo Page</title>
      </Helmet>
      <MapInfo routeTypes={data.keys} routeData={data.values}/>
    </div>
  );
}

export default DemoPage;