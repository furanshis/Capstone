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
    pinpass: string;
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
  
  export interface Asistencia2 {
    uid: string; // UID del empleado
    fechaCreacion: Date;
    fechaSalida?: Date; // Fecha de creación
    horaEntrada: string; // Hora de entrada
    horaSalida: string; // Hora de salida (opcional)
    horasTrabajadas: number; // Horas trabajadas (opcional)
    validacionBiometrica: boolean; // Validación biométrica
    horasExtras: number; // Horas extras
    latitud: number; // Latitud
    longitud: number; // Longitud
  }
  