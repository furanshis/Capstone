import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Asistencia } from '../asistencia/asistencia.entity';
import { Supervisor } from '../supervisor/supervisor.entity';


@Entity('reporte_asistencia')
export class ReporteAsistencia {
  @PrimaryGeneratedColumn()
  id_reporte: number;

  @ManyToOne(() => Supervisor, (supervisor) => supervisor.id_supervisor)
  @JoinColumn({ name: 'id_supervisor' })
  supervisor: Supervisor;

  @ManyToOne(() => Asistencia, (asistencia) => asistencia.id_asistencia)
  @JoinColumn({ name: 'id_asistencia' })
  asistencia: Asistencia;

  @Column({ type: 'date' })
  fecha_reporte: Date;

  @Column({ type: 'double precision', default: 0 })
  total_horas_trabajadas: number;

  @Column({ type: 'int', default: 0 })
  numero_tardanzas: number;

  @Column({ type: 'int', default: 0 })
  numero_ausencias: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}