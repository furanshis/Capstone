import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc, collectionData, getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  allowedDomain: string = '@duocuc.cl';  // El dominio permitido
  email: string = '';  // Variable para almacenar el correo electrónico
  password: string = '';  // Variable para almacenar la contraseña
  rememberMe: boolean = false;

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private alertController: AlertController
  ) { }

  // Método para iniciar sesión con Google
  // Método para iniciar sesión con Google
  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        const userEmail = result.user?.email;

        if (userEmail && this.isAllowedDomain(userEmail)) {
          // El correo es de la empresa permitida, permitir acceso
          this.router.navigateByUrl('/inicio');
        } else {
          // Si el correo no es válido, cerrar sesión y mostrar alerta
          this.afAuth.signOut();
          this.showAlert('Acceso Denegado', 'Solo los correos de @empresax.cl tienen acceso.');
        }
      })
      .catch((error) => {
        console.error('Login error: ', error);
        this.showAlert('Error', 'Ocurrió un error al iniciar sesión. Intenta de nuevo.');
      });
  }

  // Método para iniciar sesión con correo y contraseña
  loginWithEmail() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        const userEmail = result.user?.email;
        const uid = result.user?.uid;

        let path = `Empleados/${uid}`

        this.getDocument(path).then(empleado =>{
          this.saveInLocalStorage('Empleados', empleado)
          console.log(empleado)
          if (userEmail && this.isAllowedDomain(userEmail)) {
            // El correo es de la empresa permitida, permitir acceso
            this.router.navigateByUrl('/inicio');
          } else {
            // Si el correo no es válido, cerrar sesión y mostrar alerta
            this.afAuth.signOut();
            this.showAlert('Acceso Denegado', 'Solo los correos de @empresax.cl tienen acceso.');
          }
        })

        
      })
      .catch((error) => {
        console.error('Login error: ', error);
        this.showAlert('Error', 'Correo o contraseña incorrectos.');
      });
  }


  // Verificar si el correo tiene el dominio permitido
  isAllowedDomain(email: string): boolean {
    return email.endsWith(this.allowedDomain);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // Método para mostrar una alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  forgotPassword() {
    // Implementar la lógica para recuperar contraseña
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data()
  }


  // Método para cerrar sesión
  logout() {
    this.afAuth.signOut()
      .then(() => {
        console.log('User logged out');
      })
      .catch((error) => {
        console.error('Logout error: ', error);
      });
    
    
      
  }

  ngOnInit() {
  }

}
