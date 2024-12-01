import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinScreenPageRoutingModule } from './pin-screen-routing.module';

import { PinScreenPage } from './pin-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinScreenPageRoutingModule
  ],
  declarations: [PinScreenPage]
})
export class PinScreenPageModule {}
