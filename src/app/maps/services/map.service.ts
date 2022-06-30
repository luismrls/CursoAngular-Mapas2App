import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../apis/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';
import { Feature } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private markers: Marker[] = [];
  private map?: Map;

  get isMapReady(){
    return !!this.map;
  }

  constructor(private directionApi: DirectionsApiClient) {}

  setMap(map: Map){
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    })

  }

  createMarkersFromPlaces(places: Feature[], userLocatacion: [number, number]) {

    if(!this.map) throw Error('Mapa no inicializado');

    this.markers.forEach(marker => marker.remove());
      
    const newMarkers: Marker[] = [];

    places.forEach(place => {
      const[lng, lat] = place.center;
      const popup = new Popup()
      .setHTML(` 
        <h6>${place.text}</h6>
        <span>${place.place_name}</span>
      `);

      const newMarker = new Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.map!)

      newMarkers.push(newMarker)
    });

    this.markers = newMarkers;

    if(places.length === 0) return;

    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocatacion)


    this.map.fitBounds(bounds, {padding: 200})
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => {
        console.log(resp);
        this.drawPolyline(resp.routes[0])
      })
  }

  private drawPolyline(route: Route) {
    console.log({kms: route.distance / 1000, duration: route.duration / 60});

    if(!this.map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    })

    this.map?.fitBounds(bounds, {
      padding: 200
    })

    

    //linea entre los dos punto
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    if( this.map.getLayer('RoutesStirng')) {
      this.map.removeLayer('RoutesStirng');
      this.map.removeSource('RoutesStirng');
    }

    this.map.addSource('RoutesStirng', sourceData);

    this.map.addLayer({
      id: 'RoutesStirng',
      type: 'line',
      source: 'RoutesStirng',
      layout: {
        "line-cap": 'round',
        "line-join": 'round',
      },
      paint: {
        "line-color": 'black',
        "line-width": 3
      }
    })
  }

}
