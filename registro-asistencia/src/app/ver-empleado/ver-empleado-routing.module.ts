import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerEmpleadoPage } from './ver-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: VerEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerEmpleadoPageRoutingModule {}
