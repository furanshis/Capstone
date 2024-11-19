import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private router: Router
  ) { }

  async login(): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        this.email,
        this.password
      );
      if (userCredential.user) {
        // Redirigir a la vista admin principal
        this.router.navigate(['/vista-admin']);
        const toast = await this.toastController.create({
          message: 'Bienvenido a la vista de administrador.',
          duration: 2000,
          color: 'success',
        });
        toast.present();
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      const toast = await this.toastController.create({
        message: 'Credenciales inválidas. Inténtelo de nuevo.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }
 
}
