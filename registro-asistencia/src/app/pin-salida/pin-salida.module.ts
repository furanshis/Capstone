import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinSalidaPageRoutingModule } from './pin-salida-routing.module';

import { PinSalidaPage } from './pin-salida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinSalidaPageRoutingModule
  ],
  declarations: [PinSalidaPage]
})
export class PinSalidaPageModule {}
