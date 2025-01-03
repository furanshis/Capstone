import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Empleado } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://192.168.1.85:3000/empleados';

  constructor(private http: HttpClient) { }

  crearEmpleado(empleado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, empleado);
  }
}
