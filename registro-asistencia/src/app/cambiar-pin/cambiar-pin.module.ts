import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarPinPageRoutingModule } from './cambiar-pin-routing.module';

import { CambiarPinPage } from './cambiar-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarPinPageRoutingModule
  ],
  declarations: [CambiarPinPage]
})
export class CambiarPinPageModule {}
