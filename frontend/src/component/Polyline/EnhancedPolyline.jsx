import { useState } from "react";
import { Polyline, Popup } from "react-leaflet";

function EnhancedPolyline({positions, color, popup}) {
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
        <Popup>
          <h3>{popup.date}</h3>
          <p>Length: {popup.distance / 1000} KM</p>
          <p>Duration: {popup.duration.slice(2)}</p>
          <p>Calories: {popup.calories} kcal</p>
        </Popup>
      </Polyline>
    </>
  );
}

export default EnhancedPolyline;