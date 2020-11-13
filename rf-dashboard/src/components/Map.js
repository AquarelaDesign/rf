import React, { useState, useRef, useCallback } from "react";

import {
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api"

import mapMarker from '../assets/map_maker_50.png'

const containerStyle = {
  Display: "flex",
  height: "90%",
  width: "100%",
}

function Map({ markers, origem, destino, paradas, defaultCenter, defaultZoom }) {
  const mapRef = useRef()

  // const [response, setResponse] = useState(null)
  const [dadosInfo, setDadosInfo] = useState(null)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const onMapLoad = useCallback((map) => {
    mapRef.current = map
    
    const imageMarker = {
      url: mapMarker,
      // scaledSize: new window.google.maps.Size(50, 50),
      origin: new window.google.maps.Point(0,0),
      anchor: new window.google.maps.Point(0,0)
    }
        
    var directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    })
    var directionsService = new window.google.maps.DirectionsService()
    var infowindow = new window.google.maps.InfoWindow()

    directionsRenderer.setMap(map)

    console.log('**** Maps.onMapLoad', origem, destino ,paradas)
    
    let w = []
    paradas.map(way => {
      w.push({
        location: way
      })
    })

    const waypoints = Array.from(new Set(w.map(a => a.lat)))
      .map(lat => {
        return w.find(a => a.lat === lat)
      })

    var travelMode = 'DRIVING'
    var start = new window.google.maps.LatLng(origem.lat, origem.lng)
    var end = new window.google.maps.LatLng(destino.lat, destino.lng)

    var request = {
      origin: start,
      destination: end,
      // unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      travelMode: window.google.maps.DirectionsTravelMode[travelMode],
      waypoints: waypoints,
      optimizeWaypoints: true,
      // transitOptions: { arrivalTime: new Date(1337675679473) }
    }

    directionsService.route(request, function (response, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(response)

        console.log('**** Maps.directionsService', response)
        console.log('**** Maps.waypoints', markers)

        var marker, i

        for (i = 0; i < markers.length; i++) {  
          marker = new window.google.maps.Marker({
            position: new window.google.maps.LatLng(markers[i].lat, markers[i].lng),
            animation: 'DROP',
            icon: mapMarker,
            map: map
          });

          let info = `<strong>${markers[i].nome}</strong><br/>${markers[i].logradouro}, ${markers[i].numero}`
          if (markers[i].complemento !== null) {
            info += `, ${markers[i].complemento}<br/>`
          } else {
            info += `<br/>`
          }
          info += `${markers[i].bairro} - ${markers[i].cidade}/${markers[i].uf}` 
    
          window.google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              console.log("in click listener")
              console.log(info)
              infowindow.setContent(info)
              infowindow.open(map, marker)
            }
          })(marker, i))
        }        
        
        if (dadosInfo === null) {
          // setResponse(response)
          const lgs = response.routes[0].legs
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
        // alertar uma mensagem de erro quando a rota não puder ser calculada.
        if (status == 'ZERO_RESULTS') {
          console.log('**** Maps.directionsCallback','Nenhuma rota foi encontrada entre a origem e o destino.')
        } else if (status == 'UNKNOWN_ERROR') {
          console.log('**** Maps.directionsCallback','Uma solicitação de rota não pôde ser processada devido a um erro do servidor. A solicitação pode ser bem-sucedida se você tentar novamente.')
        } else if (status == 'REQUEST_DENIED') {
          console.log('**** Maps.directionsCallback','Esta página da web não tem permissão para usar o serviço de rotas.')
        } else if (status == 'OVER_QUERY_LIMIT') {
          console.log('**** Maps.directionsCallback','A página da web ultrapassou o limite de solicitações em um período de tempo muito curto.')
        } else if (status == 'NOT_FOUND') {
          console.log('**** Maps.directionsCallback','Não foi possível geocodificar pelo menos um dos pontos de origem, destino ou waypoints.')
        } else if (status == 'INVALID_REQUEST') {
          console.log('**** Maps.directionsCallback','O DirectionsRequest fornecido era inválido.')
        } else {
          console.log('**** Maps.directionsCallback',"Ocorreu um erro desconhecido em sua solicitação. Requeststatus: \n\n" + status)
        }
      }
    })
  }, [origem, destino])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#fff8dc' 
    }}>
      <LoadScript googleMapsApiKey="AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          onLoad={onMapLoad}
          zoom={defaultZoom || 4}
        >
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

