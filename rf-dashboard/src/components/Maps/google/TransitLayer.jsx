import { useEffect, useState } from "react";

export default function TransitLayer({ enabled, maps, map }) {
  const [transitLayer, setTransitLayer] = useState();
  useEffect(() => {
    setTransitLayer(new maps.TransitLayer());
  }, []);

  useEffect(
    () => {
      if (transitLayer) {
        enabled ? transitLayer.setMap(map) : transitLayer.setMap(null);
      }
    },
    [enabled]
  );

  return null;
}
