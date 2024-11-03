import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asistencia } from 'src/asistencia/asistencia.entity';

@Entity()
export class Empleados {

    @PrimaryGeneratedColumn()
    id_empleado: number;

    @Column()
    primer_nombre: string;

    @Column()
    segundo_nombre: string;

    @Column()
    apellido_paterno: string;

    @Column()
    apellido_materno: string;

    @Column({type: 'time with time zone', nullable: true})
    horario_entrada_real: string;

    @Column({type: 'time with time zone', nullable: true})
    horario_salida_real: string;

    @OneToMany(() => Asistencia, (asistencia) => asistencia.empleado_id)
    asistencias: Asistencia[];

}