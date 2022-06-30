import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../apis';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  constructor(private placesApiClient: PlacesApiClient, private mapService: MapService) {
    this.getUserLocation();
   }

  public async getUserLocation(): Promise<[number, number]> {
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {

          this.useLocation = [coords.longitude, coords.latitude];
          resolve( this.useLocation );

        }, (err) => {

          alert('No se pudo obtener la geolocalizacion');
          console.log(err);
          reject();
        }
      )
    })
  }


// types=place,postcode,address&language=es&limit=1&access_token=pk.eyJ1IjoibWFnZGllbG1zIiwiYSI6ImNreXB6ZXJ1azBjeXEybnMyYm01bHk0aHAifQ.8iVI9ERFXi5ET09QbKJcww
  getPlaceByQuery(query: string = '') {

    if(query.length === 0){
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if(!this.useLocation) throw Error('No hay userLocation')

    this.isLoadingPlaces = true;

    this.placesApiClient.get<PlacesResponse>(`/${query}.json?`, {
      params: {
        proximity: this.useLocation.join(',')
      }
    })
     .subscribe(response => {

      this.isLoadingPlaces = false;
      this.places = response.features;

      this.mapService.createMarkersFromPlaces(this.places, this.useLocation!)
      
     })
  }


}
