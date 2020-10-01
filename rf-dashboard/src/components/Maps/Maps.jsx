import React, { useState, useEffect } from "react";
import Map from "./google/Map";
import Marker from "./google/Marker";
import TransitLayer from "./google/TransitLayer";
import getPlaces from "./utils/getPlaces";

export default function Maps({ places, defaultCenter }) {
  // const places = getPlaces();
  const [placeIndex, setPlaceIndex] = useState(0);
  const [bound, setBound] = useState({});
  const [transitLayerEnabled, setTransitLayerEnabled] = useState(false);

  useEffect(() => {
    console.log('**** Maps.useEffert.places', places)
  }, [])

  // return (<div>Mapa</div>)
  
  return (
    // <div style={{ width: '100%', height: '100%' }}>
    //   <h3>Basic google maps with React hooks </h3>
      <Map
        zoom={10}
        // center={{ lat: places[placeIndex].lat, lng: places[placeIndex].lng }}
        center={ defaultCenter }
        events={{ onBoundsChangerd: arg => setBound(arg) }}
        style={{ width: '300px', height: '300px' }}
      >
        <TransitLayer enabled={transitLayerEnabled} />
        { console.log('**** Maps.useEffert.places', places) }

        {
          places.map((m, index) => (
            <Marker
              key={m.id}
              active={placeIndex === index}
              title={"marker id: " + m.id}
              position={{ lat: m.lat, lng: m.lng }}
              events={{
                onClick: () => window.alert(`marker ${index} clicked`)
              }}
            />
          ))
        }
      </Map>
    //   <button
    //     className="btn"
    //     onClick={() => setPlaceIndex((placeIndex + 1) % places.length)}
    //   >
    //     Next place
    //   </button>
    //   <br />
    //   <button
    //     type="button"
    //     className="btn"
    //     onClick={() => setTransitLayerEnabled(!transitLayerEnabled)}
    //   >
    //     Toggle transit layer
    //   </button>
    //   <br />
    //   Current place id: {places[placeIndex].id}
    //   <br />
    //   Map bounds: {bound.toString()}
    // </div>
  );
  
}
