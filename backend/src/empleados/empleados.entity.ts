import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Departamento } from 'src/departamento/departamento.entity';
import { Supervisor } from 'src/supervisor/supervisor.entity';

@Entity()
export class Empleados {

    @PrimaryGeneratedColumn()
    id_empleado: number;

    @Column({type: 'varchar', nullable: true})
    uid_empleado: string;

    @Column({ type: 'varchar', nullable: true })
    primer_nombre: string;

    @Column({ type: 'varchar', nullable: true })
    segundo_nombre: string;

    @Column({ type: 'varchar', nullable: true })
    apellido_paterno: string;

    @Column({ type: 'varchar', nullable: true })
    apellido_materno: string;

    @Column({type: 'time with time zone', nullable: true})
    horario_entrada_real: string;

    @Column({type: 'time with time zone', nullable: true})
    horario_salida_real: string;

    @Column()
    pin: string;

    

    @ManyToOne(() => Departamento, (departamento) => departamento.id_departamento)
    @JoinColumn({name: 'departamento_id'})
    departamento: Departamento;

    @ManyToOne(() => Supervisor, (supervisor) => supervisor.id_supervisor)
    @JoinColumn({name: 'supervisor_id'})
    supervisor: Supervisor;



}