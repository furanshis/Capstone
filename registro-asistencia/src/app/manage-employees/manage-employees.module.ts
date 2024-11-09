import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageEmployeesPageRoutingModule } from './manage-employees-routing.module';

import { ManageEmployeesPage } from './manage-employees.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageEmployeesPageRoutingModule
  ],
  declarations: [ManageEmployeesPage]
})
export class ManageEmployeesPageModule {}
