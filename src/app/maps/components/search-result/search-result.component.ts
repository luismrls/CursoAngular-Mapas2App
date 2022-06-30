import { Component, OnInit } from '@angular/core';
import { Feature } from '../../interfaces/places.interface';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  
  public selectedId: String = ';'

  constructor(private placesService: PlacesService, private mapService: MapService) { }

  get isLoadingPlaces() {
    return this.placesService.isLoadingPlaces;
  }

  get places() {
    return this.placesService.places
  }

  flyTo(place: Feature) {
    this.selectedId = place.id;
    
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat])

  }

  getDirection(place: Feature) {

    if(!this.placesService.useLocation) throw Error('No hay user locatacion');

    this.placesService.deletePlaces();

    const start = this.placesService.useLocation;
    const end = place.center as [number, number];

    this.mapService.getRouteBetweenPoints(start, end);

  }
}
