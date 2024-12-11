import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaAdminPage } from './vista-admin.page';

const routes: Routes = [
  {
    path: '',
    component: VistaAdminPage
  },
  {
    path: 'crear-usuario',
    loadChildren: () => import('./crear-usuario/crear-usuario.module').then( m => m.CrearUsuarioPageModule)
  },
  {
    path: 'chatbot',
    loadChildren: () => import('./chatbot/chatbot.module').then( m => m.ChatbotPageModule)
  },
  {
    path: 'registro-asistencia',
    loadChildren: () => import('./registro-asistencia/registro-asistencia.module').then( m => m.RegistroAsistenciaPageModule)
  },
  {
    path: 'empleados',
    loadChildren: () => import('./empleados/empleados.module').then( m => m.EmpleadosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaAdminPageRoutingModule {}
