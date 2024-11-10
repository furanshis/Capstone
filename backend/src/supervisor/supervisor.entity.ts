// supervisor.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Empleados } from 'src/empleados/empleados.entity';

@Entity()
export class Supervisor {
  @PrimaryGeneratedColumn()
  id_supervisor: number;

  @Column()
  primer_nombre: string;

  @Column()
  segundo_nombre: string;

  @Column()
  apellido_paterno: string;

  @Column()
  apellido_materno: string;

  @OneToMany(() => Empleados, (empleados) => empleados.supervisor)
  empleados: Empleados[];
}
