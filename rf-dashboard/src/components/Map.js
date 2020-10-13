import React, { useState, useRef, useCallback } from "react";

import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  Display: "flex",
  height: "90%",
  width: "100%",
};

function Map({ markers, origem, destino, paradas, defaultCenter, defaultZoom }) {
  const mapRef = useRef()

  const [response, setResponse] = useState(null)
  const [waypoints, setWaypoints] = useState([])

  const [dadosInfo, setDadosInfo] = useState(null)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  // const onMapLoad = useCallback((map) => {
  const onMapLoad = (map) => {
    mapRef.current = map;

    // console.log('**** Map.onMapLoad', origem, destino, paradas)

    let w = []
    paradas.map(way => {
      w.push({
        location: way
      })
    })

    const uniqueW = Array.from(new Set(w.map(a => a.lat)))
      .map(lat => {
        return w.find(a => a.lat === lat)
      })

    setWaypoints(uniqueW)

    // console.log('**** Map.montaRotas', uniqueW, waypoints)

  }
  // }, [origem, destino])

  const directionsCallback = (resp) => {
    // console.log('**** Maps.directionsCallback', resp)
    
    if (resp !== null) {
      try {
        if (resp.status === 'OK') {
          // console.log('**** Maps.directionsCallback', resp.routes[0].legs[0].distance)
          if (dadosInfo === null) {
            setResponse(resp)
            const lgs = resp.routes[0].legs
            let dist = 0
            lgs.map(d => {
              dist += d.distance.value
            })

            setDadosInfo({
              distancia: `${Math.round(dist / 1000)} km`,
              tempo: `${Math.round((dist / 1000) / 500)} dias`,
            })
          }
        } else {
          if (resp.status === 'OVER_QUERY_LIMIT') {
            sleep(25000)
          } 
          // console.log('resp: ', resp)
        }
      }
      catch (e) {}
    }
    
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '95%', backgroundColor: '#fff8dc' }}>
      <LoadScript googleMapsApiKey="AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          onLoad={onMapLoad}
          zoom={defaultZoom || 4}
        >
          <DirectionsService
            options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
              destination: `${destino.lat},${destino.lng}`,
              origin: `${origem.lat},${origem.lng}`,
              waypoints: waypoints,
              travelMode: 'DRIVING',
              // timeout: 100000,
            }}
            callback={directionsCallback}
          />

          {
            response !== null && (
              <DirectionsRenderer
                options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                  directions: response,
                  preserveViewport: true
                }}
              />
            )
          }
        </GoogleMap>
      </LoadScript>
      
      {dadosInfo &&
        <div style={{
          width: '100%', 
          height: '5%',
          fontSize: 16,
          color: '#000000',
          margin: 'auto',
          width: '50%',
          padding: '10px',
          textAlign: 'center',
        }}>
          Distância aproximada: <span style={{ fontWeight: 'bold', marginRight: '30px' }}>{dadosInfo.distancia}</span>
          Tempo estimado: <span style={{ fontWeight: 'bold' }}>{dadosInfo.tempo}</span>
        </div>
      }
    </div>
  )
}

export default Map

