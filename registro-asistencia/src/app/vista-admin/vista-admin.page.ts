import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-vista-admin',
  templateUrl: './vista-admin.page.html',
  styleUrls: ['./vista-admin.page.scss'],
})
export class VistaAdminPage  {

  constructor(private router: Router) { }

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.router.navigate(['/login-admin']); // Redirige a la página de login
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

}
