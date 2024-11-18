import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Asistencia } from '../interfaces/models';
import { catchError, switchMap } from 'rxjs/operators';

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

  marcarSalida(id: number): Observable<Asistencia>{
    const now = new Date();

    const hora_salida = now.toTimeString().split(' ')[0]
    return this.http.patch<Asistencia>(`${this.apiUrl}/asistencia/${id}/salida`, {})
  }

  // Validar PIN
  validarPin(uid: string, pin: string): Observable<boolean> {
    const data = { uid, pin };
    return this.http.post<boolean>(`${this.apiUrl}/empleados/validar-pin`, data);
  }

  // Verificar si existe una asistencia para el empleado hoy
  verificarAsistencia(uid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/asistencia/verificar/${uid}`);
  }
}
