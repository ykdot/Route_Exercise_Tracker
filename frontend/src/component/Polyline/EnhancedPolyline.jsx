import { useState } from "react";
import { Polyline, Popup } from "react-leaflet";

function EnhancedPolyline({positions, color}) {
  const [isSelected, setSelectedStatus] = useState(false);

  if (isSelected) {
    color = 'blue';
  }

  return (
    <>
      <Polyline 
        positions={positions} 
        pathOptions={{ color: color }}
        eventHandlers={{
              click: () => {
                setSelectedStatus(!isSelected);
              },
            }}>
      </Polyline>
    </>
  );
}

export default EnhancedPolyline;