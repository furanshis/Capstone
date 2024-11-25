export interface Asistencia {
    id_asistencia: number;
    fecha_asistencia: string;
    hora_entrada: string;
    hora_salida: string;
    horas_trabajadas: number;
    horas_extras: number;
    geolocacion: {
      x: number;
      y: number;
    };
    validacion_biometrica: boolean;
    empleado: Empleado;
  }
  
  export interface Empleado {
    id_empleado: number;
    uid_empleado: string;
    primer_nombre: string;
    segundo_nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    hora_entrada_real: string;
    hora_salida_real: string;
    pin: StaticRange;
  }

  interface Supervisor {
    id_supervisor: number;
    primer_nombre: string;
    segundo_nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
  }
  
  export interface Reporte {
    id_reporte: number;
    fecha_reporte: string;
    total_horas_trabajadas: number;
    numero_tardanzas: number;
    numero_ausencias: number;
    asistencia: Asistencia;
    supervisor: Supervisor;
  }