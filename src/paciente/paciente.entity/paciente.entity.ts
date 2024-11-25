/* eslint-disable prettier/prettier */
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity/diagnostico.entity';
import { MedicoEntity } from '../../medico/medico.entity/medico.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class PacienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  genero: string;

  @ManyToMany(() => MedicoEntity, (medico) => medico.pacientes)
  @JoinTable()
  medicos: MedicoEntity[];

  @OneToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.paciente)
  diagnosticos: DiagnosticoEntity[];
}