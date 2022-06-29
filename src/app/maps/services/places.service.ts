import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';

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

  constructor(private http: HttpClient) {
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

  getPlaceByQuery(query: string = '') {

    this.isLoadingPlaces = true;

    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?types=place,postcode,address&language=es&limit=1&access_token=pk.eyJ1IjoibWFnZGllbG1zIiwiYSI6ImNreXB6ZXJ1azBjeXEybnMyYm01bHk0aHAifQ.8iVI9ERFXi5ET09QbKJcww`)
     .subscribe(response => {
      console.log(response.features)
      this.isLoadingPlaces = false;
      this.places = response.features;
     })
  }


}
