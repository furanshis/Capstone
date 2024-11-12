import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empleados } from '../empleados/empleados.entity';

@Entity()
export class Asistencia {
    @PrimaryGeneratedColumn()
    id_asistencia: number;

    @Column({type: 'date', nullable: true})
    fecha_asistencia: Date;

    @Column({type: 'time', nullable: true})
    hora_entrada: string;

    @Column({type: 'time', nullable: true})
    hora_salida: string;

    @Column({type: 'double precision', nullable: true})
    horas_trabajadas: string;

    @Column({type: 'double precision', nullable: true})
    horas_extras: string;

    @Column({type: 'point', nullable: true})
    geolocacion: string;

    @Column({ type: 'boolean', default: false })
    validacion_biometrica: boolean;

    @ManyToOne(() => Empleados, (empleados) => empleados.id_empleado)
    @JoinColumn({name: 'empleado_id'})
    empleado: Empleados
}