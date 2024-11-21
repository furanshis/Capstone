import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageEmployeesPage } from './manage-employees.page';

const routes: Routes = [
  {
    path: 'empleados',
    component: ManageEmployeesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageEmployeesPageRoutingModule {}
