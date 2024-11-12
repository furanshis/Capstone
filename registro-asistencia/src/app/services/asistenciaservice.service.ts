import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asistencia } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaserviceService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createAttendance(id: number): Observable<Asistencia> {
    const now = new Date();
    
    const attendance = {
      fecha_asistencia: now.toISOString().split('T')[0], // YYYY-MM-DD
      hora_entrada: now.toTimeString().split(' ')[0], // HH:MM:SS
      hora_salida: null,
      horas_trabajadas: 0,
      horas_extras: 0,
      geolocacion: `(40.7128, -74.006)`,
      validacion_biometrica: false,
      empleado: id
    };

    return this.http.post<Asistencia>(`${this.apiUrl}/asistencia`, attendance);
  }
}
