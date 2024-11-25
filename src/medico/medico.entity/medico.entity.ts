/* eslint-disable prettier/prettier */
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class MedicoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  especialidad: string;

  @Column({ type: 'varchar', length: 15 })
  telefono: string;

  @ManyToMany(() => PacienteEntity, (paciente) => paciente.medicos)
  @JoinTable()
  pacientes: PacienteEntity[];
}
