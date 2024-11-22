/* eslint-disable prettier/prettier */
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


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

  @OneToMany(() => PacienteEntity, (paciente) => paciente.medico)
  pacientes: PacienteEntity[];
}