// supervisor.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Empleados } from '../empleados/empleados.entity';

@Entity()
export class Supervisor {
  @PrimaryGeneratedColumn()
  id_supervisor: number;

  @Column({ type: 'varchar', nullable: true })
  primer_nombre: string;

  @Column({ type: 'varchar', nullable: true })
  segundo_nombre: string;

  @Column({ type: 'varchar', nullable: true })
  apellido_paterno: string;

  @Column({ type: 'varchar', nullable: true })
  apellido_materno: string;

  @OneToMany(() => Empleados, (empleados) => empleados.supervisor)
  empleados: Empleados[];
}
