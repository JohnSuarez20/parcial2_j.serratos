/* eslint-disable prettier/prettier */
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class DiagnosticoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 200 })
  descripcion: string;

  @ManyToOne(() => PacienteEntity, (paciente) => paciente.diagnosticos)
  paciente: PacienteEntity;
}