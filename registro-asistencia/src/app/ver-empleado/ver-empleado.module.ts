import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEmpleadoPageRoutingModule } from './ver-empleado-routing.module';

import { VerEmpleadoPage } from './ver-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerEmpleadoPageRoutingModule
  ],
  declarations: [VerEmpleadoPage]
})
export class VerEmpleadoPageModule {}
