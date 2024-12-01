import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PinScreenPage } from './pin-screen.page';

const routes: Routes = [
  {
    path: '',
    component: PinScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PinScreenPageRoutingModule {}
