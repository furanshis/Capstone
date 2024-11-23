// departamento.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Empleados } from '../empleados/empleados.entity';

@Entity()
export class Departamento {
  @PrimaryGeneratedColumn()
  id_departamento: number;

  @Column({ nullable: true })
  nombre_departamento: string;

  @OneToMany(() => Empleados, (empleados) => empleados.departamento)
  empleados: Empleados[];
}