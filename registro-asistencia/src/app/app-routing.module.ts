import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'solicitudregistro',
    loadChildren: () => import('./solicitudregistro/solicitudregistro.module').then( m => m.SolicitudregistroPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'lockscreen',
    loadChildren: () => import('./lockscreen/lockscreen.module').then( m => m.LockscreenPageModule)
  },
  {
    path: 'change-pin',
    loadChildren: () => import('./change-pin/change-pin.module').then( m => m.ChangePinPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'manage-employees',
    loadChildren: () => import('./manage-employees/manage-employees.module').then( m => m.ManageEmployeesPageModule)
  },  {
    path: 'adminpanel',
    loadChildren: () => import('./adminpanel/adminpanel.module').then( m => m.AdminpanelPageModule)
  },
  {
    path: 'perfilusuario',
    loadChildren: () => import('./perfilusuario/perfilusuario.module').then( m => m.PerfilusuarioPageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
