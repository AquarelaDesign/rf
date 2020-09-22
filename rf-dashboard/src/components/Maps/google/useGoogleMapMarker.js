import { useEffect, useState } from "react";

const eventMapping = {
  onClick: "click",
  onDoubleClick: "dblclick"
};

export default function useGoogleMapMarker({
  position,
  type,
  maps,
  map,
  events,
  title
}) {
  const [marker, setMarker] = useState();
  useEffect(() => {
    // const styles = markerStyle(type);
    const marker = new maps.Marker({
      position,
      map,
      title
    });
    Object.keys(events).forEach(eventName =>
      marker.addListener(eventMapping[eventName], events[eventName])
    );
    setMarker(marker);
  }, []);

  return marker;
}
