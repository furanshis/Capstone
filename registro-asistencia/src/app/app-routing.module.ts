import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthAdmin } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  
  {
    path: 'solicitudregistro',
    loadChildren: () => import('./solicitudregistro/solicitudregistro.module').then( m => m.SolicitudregistroPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [AuthGuard] // Protege también esta ruta
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
  },
  {
    path: 'adminpanel',
    loadChildren: () => import('./adminpanel/adminpanel.module').then( m => m.AdminpanelPageModule)
  },
  {
    path: 'perfilusuario',
    loadChildren: () => import('./perfilusuario/perfilusuario.module').then( m => m.PerfilusuarioPageModule),
  },
  {
    path: 'reporteadmin',
    loadChildren: () => import('./reporteadmin/reporteadmin.module').then( m => m.ReporteadminPageModule)
  },
  {
    path: 'vista-admin',
    loadChildren: () => import('./vista-admin/vista-admin.module').then( m => m.VistaAdminPageModule),
    canActivate: [AuthAdmin]
  },
  {
    path: 'ver-empleado',
    loadChildren: () => import('./ver-empleado/ver-empleado.module').then( m => m.VerEmpleadoPageModule)
  },
  {
    path: 'login-admin',
    loadChildren: () => import('./login-admin/login-admin.module').then( m => m.LoginAdminPageModule)
  },
  {
    path: 'pin-screen',
    loadChildren: () => import('./pin-screen/pin-screen.module').then( m => m.PinScreenPageModule)
  },
  {
    path: 'pin-salida',
    loadChildren: () => import('./pin-salida/pin-salida.module').then( m => m.PinSalidaPageModule)
  },
  {
    path: 'cambiar-pin',
    loadChildren: () => import('./cambiar-pin/cambiar-pin.module').then( m => m.CambiarPinPageModule)
  },








];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
