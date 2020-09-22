import { useEffect } from "react";
import useGoogleMapMarker from "./useGoogleMapMarker";

const activeIcon =
  "https://a0.muscache.com/airbnb/static/select_pdp/home_icon-9999d1852c239e9a93c7d7975441c254.png";
const inactiveIcon =
  "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png";

export default function Marker({
  position,
  type,
  maps,
  map,
  events,
  active = false,
  title
}) {
  const marker = useGoogleMapMarker({
    position,
    type,
    maps,
    map,
    events,
    title
  });

  useEffect(
    () => {
      marker &&
        (active ? marker.setIcon(activeIcon) : marker.setIcon(inactiveIcon));
    },
    [active]
  );

  return null;
}
