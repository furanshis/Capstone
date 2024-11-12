import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteadminPage } from './reporteadmin.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class ReporteadminPageRoutingModule {}
