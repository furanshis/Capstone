import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService } from './autenticacion.service';


@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'http://192.168.1.84:3000/asistencia';

  constructor(private http: HttpClient, private autenticacionService: AutenticacionService) { }

  async getHorasTrabajadasSemana(): Promise<any> {
    const uid = await this.autenticacionService.getUid();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${uid}`);
    return this.http.get(`${this.apiUrl}/horas-semana`, { headers }).toPromise();
  }

}
