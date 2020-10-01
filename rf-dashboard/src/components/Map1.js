import React, {useState, useEffect, useCallback, memo} from 'react'

import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  DirectionsService, 
  DirectionsRenderer,
  DistanceMatrixService, 
  InfoWindow,
  Polyline,
} from '@react-google-maps/api'

import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@material-ui/core/styles'

const containerStyle = {
  width: '100%',
  height: '90%'
}
 
const useStyles = makeStyles((theme) => ({
  infobox: {
    position: 'absolute',
    top: 110,
    right: 32,
    width: '150px',
    height: '50px',
    border: '1px solid #2699F8'
  },
}))

const apiKey = "AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY"

function errorHandler(err) {
  if (err.code === 1) {
    console.log("Erro: acesso negado!")
  } else if (err.code === 2) {
    console.log("Erro: a posição não está disponível!")
  }
}

const options = { 
  timeout: 60000,
}

const Map = ({ places, defaultCenter }) => {
  const classes = useStyles()
  
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(defaultCenter)

  const [response, setResponse] = useState(null)
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  
  const [dadosInfo, setDadosInfo] = useState({
    distancia: '',
    tempo: '',
  })
 
  useEffect(() => {
    // console.log('**** Map.start', center, places)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showLocation,
        errorHandler,
        options
      )
      
      setTravelMode('DRIVING')
      
      console.log('**** Maps.places', places.length)

      if (places[0]) {
        setOrigin(places[0])
      }
      if (places[places.length - 1]) {
        setDestination(places[places.length - 1])
      }
    } else {
      alert("Desculpe, o navegador não suporta geolocalização! ");
    }
  }, [])

  const showLocation = (position) => {
    setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }

  const onMapClick = (...args) => {
    console.log('**** onClick args: ', args)
  }

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
    setMap(map)
  }, [])
 
  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const directionsCallback = (resp) => {
    // console.log('**** Maps.directionsCallback', resp)

    if (resp !== null) {
      if (resp.status === 'OK') {
        setResponse(resp)
        console.log('**** Maps.directionsCallback', resp.routes[0].legs[0].distance)

        setDadosInfo({
          distancia: resp.routes[0].legs[0].distance.text,
          tempo: `${Math.round((resp.routes[0].legs[0].distance.value / 1000) / 500)} dias`,
        })
      } else {
        console.log('resp: ', resp)
      }
    }
  }

  const distanceCallback = (resp) => {
    // console.log('**** Maps.distanceCallback', resp)
  }

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: places,
    zIndex: 1
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LoadScript
        googleMapsApiKey={apiKey}
      >
        <GoogleMap
          id='direction-map'
          mapContainerStyle={containerStyle}
          center={center}
          zoom={2}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
        >
          {
            places.map(maker => (
              <Marker
                key={uuidv4()}
                position={maker}
              />
            ))
          }
          
          {/* 
          <Polyline
            // onLoad={onLoad}
            path={places}
            options={options}
          /> 
          */}

          {
            (
              destination !== '' && origin !== ''
            ) && (
              <>
                <DirectionsService
                  options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                    destination: destination,
                    origin: origin,
                    travelMode: travelMode
                  }}
                  callback={directionsCallback}
                />

                {
                  response !== null && (<>
                    <DistanceMatrixService
                      options={{
                        destinations: [destination],
                        origins: [origin],
                        travelMode: travelMode,
                      }}
                      callback={distanceCallback}
                    />

                    <DirectionsRenderer
                      options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                        directions: response
                      }}
                    />
                  </>)
                }
              </>
            )
          }
        </GoogleMap>
      </LoadScript>

      <div style={{ 
        // width: '100%', 
        height: '10%', 
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
    </div>
  )
}
 
export default memo(Map)