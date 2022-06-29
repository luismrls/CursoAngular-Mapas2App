import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapScreenComponent } from './screens/map-screen/map-screen.component';


@NgModule({
  declarations: [
    MapScreenComponent
  ],
  imports: [
    CommonModule,
    MapsRoutingModule
  ],
  exports: [
    MapScreenComponent
  ]
})
export class MapsModule { }
