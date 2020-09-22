import React, {useState, useEffect, useCallback, memo} from 'react'
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
import { v4 as uuidv4 } from 'uuid'
 
const containerStyle = {
  width: '100%',
  height: '100%'
}
 
const apiKey = "AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY"

function errorHandler(err) {
  if (err.code === 1) {
    console.log("Erro: acesso negado!")
  } else if (err.code === 2) {
    console.log("Erro: a posição não está disponível!")
  }
}

const options = { timeout: 60000 }

const Map = ({ places, defaultCenter }) => {
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState(defaultCenter)

  const [response, setResponse] = useState(null)
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
 
  useEffect(() => {
    console.log('**** Map.start', center, places)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showLocation,
        errorHandler,
        options
      )
      if (places[0]) {
        setOrigin(places[0])
      }
      if (places[1]) {
        setDestination(places[1])
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

  const directionsCallback = (resp) => {
    console.log(resp)

    if (resp !== null) {
      if (resp.status === 'OK') {
        setResponse(resp)
      } else {
        console.log('resp: ', resp)
      }
    }
  }

  const checkDriving = ({ target: { checked } }) => {
    checked && setTravelMode('DRIVING')
  }

  const checkBicycling = ({ target: { checked } }) => {
    checked && setTravelMode('BICYCLING')
  }

  const checkTransit = ({ target: { checked } }) => {
    checked && setTravelMode('TRANSIT')
  }

  const checkWalking = ({ target: { checked } }) => {
    checked && setTravelMode('WALKING')
  }

  const getOrigin = (ref) => {
    setOrigin(ref)
  }

  const getDestination = (ref) => {
    setDestination(ref)
  }

  const onClick = () => {
    if (origin.value !== '' && destination.value !== '') {
      setOrigin(origin.value)
      setDestination(destination.value)
    }
  }

  const onMapClick = (...args) => {
    console.log('onClick args: ', args)
  }

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
    setMap(map)
  }, [])
 
  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])
 
  return (
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

        {
          (
            destination !== '' && origin !== ''
          ) && (
            <DirectionsService
              // required
              options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                destination: destination,
                origin: origin,
                travelMode: travelMode
              }}
              // required
              callback={directionsCallback}
              // optional
              onLoad={directionsService => {
                console.log('DirectionsService onLoad directionsService: ', directionsService)
              }}
              // optional
              onUnmount={directionsService => {
                console.log('DirectionsService onUnmount directionsService: ', directionsService)
              }}
            />
          )
        }

        {
          response !== null && (
            <DirectionsRenderer
              // required
              options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                directions: response
              }}
              // optional
              onLoad={directionsRenderer => {
                console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
              }}
              // optional
              onUnmount={directionsRenderer => {
                console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
              }}
            />
          )
        }

      </GoogleMap>
    </LoadScript>
  )
}
 
export default memo(Map)