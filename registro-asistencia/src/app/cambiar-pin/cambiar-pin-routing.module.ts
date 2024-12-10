import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarPinPage } from './cambiar-pin.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarPinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarPinPageRoutingModule {}
