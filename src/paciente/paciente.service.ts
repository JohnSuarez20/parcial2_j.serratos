/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['diagnosticos', 'medicos'] });
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });
    if (!paciente)
      throw new BusinessLogicException(
        'El paciente con el id proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    return paciente;
  }

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3)
      throw new BusinessLogicException(
        'El nombre debe tener al menos 3 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.pacienteRepository.save(paciente);
  }

  async update(id: string, paciente: PacienteEntity): Promise<PacienteEntity> {
    const persistedPaciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
    });
    if (!persistedPaciente)
      throw new BusinessLogicException(
        'El paciente con el id proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (paciente.nombre.length < 3)
      throw new BusinessLogicException(
        'El nombre debe tener al menos 3 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );

    paciente.id = id;

    return await this.pacienteRepository.save(paciente);
  }

  async delete(id: string) {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos'],
    });
    if (!paciente)
      throw new BusinessLogicException(
        'El paciente con el id proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (paciente.diagnosticos && paciente.diagnosticos.length > 0)
      throw new BusinessLogicException(
        'No se puede eliminar un paciente con diagnosticos asociados',
        BusinessError.PRECONDITION_FAILED,
      );

    await this.pacienteRepository.remove(paciente);
  }
}

