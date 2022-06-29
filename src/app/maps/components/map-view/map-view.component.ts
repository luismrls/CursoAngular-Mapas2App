import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Map, Popup, Marker} from 'mapbox-gl';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapElement!: ElementRef;

  constructor(private placesService: PlacesService, private mapService: MapService) {}

  ngAfterViewInit(): void {

    if(!this.placesService.useLocation) throw Error('No hay userLocation')
    
    const map = new Map({
      container: this.mapElement.nativeElement,
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: this.placesService.useLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
      });
    
    const popup = new Popup()
      .setHTML(` 
        <h6>Aquí estoy</h6>
        <span>Estoy en algun lugar de este mundo</span>
      `);

    new Marker({color: 'red'})
      .setLngLat(this.placesService.useLocation)
      .setPopup(popup)
      .addTo(map)

    this.mapService.setMap(map);

  }

}
