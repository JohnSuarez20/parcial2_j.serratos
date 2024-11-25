/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { faker } from '@faker-js/faker';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('create should create a patient successfully', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.name.firstName(),
      genero: 'Masculino',
      diagnosticos: [],
      medicos: [new MedicoEntity()]
    };

    jest.spyOn(repository, 'save').mockResolvedValueOnce(paciente);

    const result = await service.create(paciente);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(paciente.nombre);
  });

  it('create should throw an exception when name is less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'Al',
      genero: 'Femenino',
      diagnosticos: [],
      medicos: [new MedicoEntity()]
    };

    await expect(service.create(paciente)).rejects.toHaveProperty('message', 'El nombre del paciente debe tener al menos 3 caracteres');
  });
});
