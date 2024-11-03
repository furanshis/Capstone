import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private afAuth: AngularFireAuth) { }

  // Obtener el UID del usuario autenticado
  async getUid(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }
}
