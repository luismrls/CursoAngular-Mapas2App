import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapScreenComponent } from './screens/map-screen/map-screen.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoadingComponent } from './components/loading/loading.component';


@NgModule({
  declarations: [
    MapScreenComponent,
    MapViewComponent,
    LoadingComponent
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
