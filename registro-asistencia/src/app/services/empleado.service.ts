import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  crearEmpleado(empleado: any): Observable<any> {
    
    

    return this.http.post(`${this.apiUrl}/empleados`, empleado);
  }
}
