import { useState } from "react";
import { Polyline } from "react-leaflet";

function EnhancedPolyline({positions, color}) {
  const [isSelected, setSelectedStatus] = useState(false);


  if (isSelected) {
    color = 'blue';
  }

  console.log(color);

  return (
    <>
      <Polyline 
        positions={positions} 
        pathOptions={{ color: color }}
        eventHandlers={{
              click: () => {
                setSelectedStatus(!isSelected);
              },
            }}/>
    </>
  );
}

export default EnhancedPolyline;