import MapInfo from '../component/Map/MapInfo';
import demoData from '../store/demo-data';

function DemoPage() {
  // https://evernote.com/

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