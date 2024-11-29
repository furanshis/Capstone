import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Asistencia, Empleado } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaserviceService {
  private apiUrl = 'http://192.168.1.84:3000';

  constructor(private http: HttpClient) { }

  getEmpleadoByUid(uid: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/empleados/${uid}`).pipe(
      catchError(this.handleError)
    );
  }

  createAttendance(uid: string): Observable<Asistencia> {
    return this.getEmpleadoByUid(uid).pipe(
      switchMap(empleado => {
        const now = new Date();
        
        const attendance = {
          fecha_asistencia: now.toISOString().split('T')[0],
          hora_entrada: now.toTimeString().split(' ')[0],
          hora_salida: null,
          horas_trabajadas: 0,
          horas_extras: 0,
          geolocacion: `(40.7128, -74.006)`,
          validacion_biometrica: false,
          empleado: 13
        };

        console.log(attendance)

        return this.http.post<Asistencia>(`${this.apiUrl}/asistencia`, attendance);
      }),
      catchError(this.handleError)
    );
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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 409) {
        errorMessage = 'Ya existe una asistencia registrada para hoy';
      } else if (error.status === 404) {
        errorMessage = 'Empleado no encontrado';
      } else {
        errorMessage = `Error: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
