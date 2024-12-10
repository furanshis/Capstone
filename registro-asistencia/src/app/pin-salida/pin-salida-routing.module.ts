import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PinSalidaPage } from './pin-salida.page';

const routes: Routes = [
  {
    path: '',
    component: PinSalidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PinSalidaPageRoutingModule {}
