import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Asistencia, Empleado, Asistencia2 } from '../interfaces/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AsistenciaserviceService {
  private apiUrl = 'http://192.168.1.85:3000';
  private collectionName = 'asistencia';

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getEmpleadoByUid(uid: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/empleados/${uid}`).pipe(
      catchError(this.handleError)
    );
  }

  createAttendance(uid: string, lat: number, lng: number): Observable<Asistencia> {
    return this.getEmpleadoByUid(uid).pipe(
      switchMap(empleado => {
        const now = new Date();
        
        const attendance = {
          fecha_asistencia: now.toISOString().split('T')[0],
          hora_entrada: now.toTimeString().split(' ')[0],
          hora_salida: null,
          horas_trabajadas: 0,
          horas_extras: 0,
          geolocacion: `(${lat}, ${lng})`,
          validacion_biometrica: false,
          empleado: empleado.id_empleado
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

   // Crear una nueva asistencia
   crearAsistencia(asistencia: Asistencia2): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único
    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .set({ ...asistencia, id });
  }

   // Actualizar una asistencia
   async actualizarAsistencia(uid: string): Promise<void> {
      const now = new Date();
      const fechaSalida = now.toISOString().split('T')[0]; // Fecha en formato 'YYYY-MM-DD'
      const horaSalida = now.toTimeString().split(' ')[0]; // Hora en formato 'HH:MM:SS'
  
      // Busca el documento de asistencia del usuario
      const asistencias = await this.firestore
        .collection<Asistencia2>(this.collectionName, ref =>
          ref.where('uid', '==', uid).orderBy('fechaCreacion', 'desc').limit(1)
        )
        .get()
        .toPromise();
  
        console.log(asistencias)
        if (!asistencias || asistencias.empty) {
          console.log('No se encontró ninguna asistencia para este usuario.');
          return
        }
  
      const asistenciaDoc = asistencias.docs[0];
      const asistencia = asistenciaDoc.data() as Asistencia2;
  
      // Calcula las horas trabajadas
      const fechaEntrada = new Date(asistencia.fechaCreacion);
      const fechaSalidaDate = new Date(`${fechaSalida}T${horaSalida}`);
      const horasTrabajadas = this.calcularHorasTrabajadas(asistencia.horaEntrada, horaSalida);
      console.log(horasTrabajadas)
  
      // Actualiza el documento en Firestore
      await this.firestore
        .collection(this.collectionName)
        .doc(asistenciaDoc.id)
        .update({
          fechaSalida: fechaSalidaDate,
          horaSalida,
          horasTrabajadas,
        });
    }
  
    calcularHorasTrabajadas(horaEntrada: string, horaSalida: string): number {
      // Día base para ambas fechas (no importa el día, pero deben ser el mismo)
      const baseDate = new Date().toISOString().split('T')[0];
    
      // Crear objetos Date para entrada y salida
      const entrada = new Date(`${baseDate}T${horaEntrada}`);
      const salida = new Date(`${baseDate}T${horaSalida}`);
    
      // Validar que las fechas sean válidas
      if (isNaN(entrada.getTime()) || isNaN(salida.getTime())) {
        throw new Error('Las horas proporcionadas no son válidas.');
      }
    
      // Calcular la diferencia en milisegundos
      const diferenciaMs = salida.getTime() - entrada.getTime();
    
      // Convertir la diferencia a horas
      const horasTrabajadas = diferenciaMs / 3600000;
    
      return horasTrabajadas;
    }
    

  async verificarAsistenciaHoy(uid: string): Promise<boolean> {
    const today = new Date();
    const fechaHoy = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  
    // Consulta Firestore
    const asistencias = await firstValueFrom(
      this.firestore
        .collection<Asistencia2>(this.collectionName, ref =>
          ref
            .where('uid', '==', uid)
            .where('fechaCreacion', '>=', new Date(`${fechaHoy}T00:00:00`))
            .where('fechaCreacion', '<=', new Date(`${fechaHoy}T23:59:59`))
        )
        .valueChanges()
    );
  
    // Retorna true si existe al menos una asistencia, false de lo contrario
    return asistencias.length > 0;
  }

  

}
