import React, { Component } from "react"
import Helmet from "react-helmet"
import "./GoogleMaps.scss"
import { MAP_STYLES } from "./MapThemes/StandardTheme"
import ErrorBoundary from '../ErrorBoundary'

var directionsDisplay

class GoogleMaps extends Component {
  componentDidMount() {
    this.renderMap()
    console.log('**** GoogleMaps.componentDidMount', this.props)
  }

  componentWillUnmount() {

  }

  renderMap = () => {
    window.initMap = this.initMap
  }

  initMap = () => {
    try {
      let latitude = this.props.defaultCenter.lat
      let longitude = this.props.defaultCenter.lng

      var rendererOptions = { draggable: true }
      directionsDisplay = new window.google.maps.DirectionsRenderer(rendererOptions)

      const map = new window.google.maps.Map(
        document.getElementById("google-map"),
        {
          center: new window.google.maps.LatLng(latitude, longitude),
          zoom: this.props.defaultZoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          scrollwheel: false,
          draggable: true,
          gestureHandling: "cooperative",
          styles: MAP_STYLES
        }
      )

    }
    catch (e) {
      
    }

    this.calcRoute()
  }

  calcRoute() {
    var directionsService = new window.google.maps.DirectionsService()

    // get the travelmode, startpoint and end point from the form       
    var travelMode = 'DRIVING'
    var start = new window.google.maps.LatLng(this.props.origem.lat, this.props.origem.lng)
    // var via = $("#routeVia").val()
    // var time = $("#arrivalTime").val()

    if (travelMode == 'TRANSIT') {
      // via = '' // if the travel mode is transit, don't use the via waypoint because that will not work
    }
    var end = new window.google.maps.LatLng(this.props.destino.lat, this.props.destino.lng) // no it isn't...endpoint is a geolocation

    // gotta have this one
    var waypoints = [] // init an empty waypoints array

    // comment out this 'if' and the map goes away
    // if (via != '') {
    //   // if waypoints (via) are set, add them to the waypoints array
    //   waypoints.push({
    //     location: via,
    //     stopover: true
    //   })
    // }

    let w = []
    this.props.paradas.map(way => {
      w.push({
        location: way
      })
    })

    const uniqueW = Array.from(new Set(w.map(a => a.lat)))
      .map(lat => {
        return w.find(a => a.lat === lat)
      })

    waypoints = uniqueW

    var request = {
      origin: start,
      destination: end,
      unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      travelMode: window.google.maps.DirectionsTravelMode[travelMode],
      waypoints: waypoints,
      optimizeWaypoints: true,
      // transitOptions: { arrivalTime: new Date(1337675679473) }
    }

    directionsService.route(request, function (response, status) {
      if (status == window.google.maps.DirectionsStatus.OK) {
        // $('#directionsPanel').empty(); // clear the directions panel before adding new directions
        directionsDisplay.setDirections(response)
        console.log('**** Maps.directionsService', response)
      } else {
        // alert an error message when the route could nog be calculated.
        if (status == 'ZERO_RESULTS') {
          alert('Nenhuma rota foi encontrada entre a origem e o destino.')
        } else if (status == 'UNKNOWN_ERROR') {
          alert('Uma solicitação de rota não pôde ser processada devido a um erro do servidor. A solicitação pode ser bem-sucedida se você tentar novamente.')
        } else if (status == 'REQUEST_DENIED') {
          alert('Esta página da web não tem permissão para usar o serviço de rotas.')
        } else if (status == 'OVER_QUERY_LIMIT') {
          alert('A página da web ultrapassou o limite de solicitações em um período de tempo muito curto.')
        } else if (status == 'NOT_FOUND') {
          alert('Não foi possível geocodificar pelo menos um dos pontos de origem, destino ou waypoints.')
        } else if (status == 'INVALID_REQUEST') {
          alert('O DirectionsRequest fornecido era inválido.')
        } else {
          alert("Ocorreu um erro desconhecido em sua solicitação. Requeststatus: \n\n" + status)
        }
      }
    })
  }

  render() {
    return (
      <div className="map-wrapper">
        <div className="map-container" id="google-map"></div>
        <Helmet>
          <script
            type="text/javascript"
            charset="UTF-8"
            async={true}
            defer={true}
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY&callback=initMap"
          />
        </Helmet>
      </div>
    )
  }
}

export default GoogleMaps
