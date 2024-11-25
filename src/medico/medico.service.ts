/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({ relations: ['pacientes'] });
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico)
        throw new BusinessLogicException(
          'No se encontro medico con este id',
          BusinessError.NOT_FOUND,
        );
  
      return medico;
    }
  
    async create(medico: MedicoEntity): Promise<MedicoEntity> {
      if (!medico.nombre || !medico.especialidad)
        throw new BusinessLogicException(
          'El nombre y la especialidad no pueden estar vacios',
          BusinessError.PRECONDITION_FAILED,
        );
  
      return await this.medicoRepository.save(medico);
    }
  
    async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
      const persistedMedico: MedicoEntity = await this.medicoRepository.findOne({
        where: { id },
    });
    if (!persistedMedico)
      throw new BusinessLogicException(
        'No se encontro medico con este id',
        BusinessError.NOT_FOUND,
      );

    if (!medico.nombre || !medico.especialidad)
      throw new BusinessLogicException(
        'El nombre y la especialidad no pueden estar vacios',
        BusinessError.PRECONDITION_FAILED,
      );

    medico.id = id;

    return await this.medicoRepository.save(medico);
  }

  async delete(id: string) {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico)
        throw new BusinessLogicException(
          'No se encontro medico con este id',
          BusinessError.NOT_FOUND,
        );
  
      if (medico.pacientes && medico.pacientes.length > 0)
        throw new BusinessLogicException(
          'No se puede eliminar un medico con pacientes asociados',
          BusinessError.PRECONDITION_FAILED,
        );
  
      await this.medicoRepository.remove(medico);
    }
  }