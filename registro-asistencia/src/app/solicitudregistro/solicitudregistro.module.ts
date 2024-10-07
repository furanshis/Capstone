import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudregistroPageRoutingModule } from './solicitudregistro-routing.module';

import { SolicitudregistroPage } from './solicitudregistro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudregistroPageRoutingModule
  ],
  declarations: [SolicitudregistroPage]
})
export class SolicitudregistroPageModule {}
