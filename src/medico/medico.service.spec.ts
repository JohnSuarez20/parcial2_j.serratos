/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity/medico.entity';
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(MedicoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
  });

  it('create should create a doctor successfully', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.name.firstName(),
      especialidad: 'Cardiología',
      telefono: faker.phone.number(),
      pacientes: [],
    };

    jest.spyOn(repository, 'save').mockResolvedValueOnce(medico);

    const result = await service.create(medico);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(medico.nombre);
    expect(result.especialidad).toEqual(medico.especialidad);
  });

  it('create should throw an exception when name or specialty is empty', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: '',
      especialidad: '',
      telefono: faker.phone.number(),
      pacientes: [],
    };

    await expect(service.create(medico)).rejects.toHaveProperty('message', 'El nombre y la especialidad no pueden estar vacíos');
  });

  it('delete should throw an exception if doctor has patients', async () => {
    const medico: MedicoEntity = {
      id: faker.string.uuid(),
      nombre: faker.name.firstName(),
      especialidad: 'Pediatría',
      telefono: faker.phone.number(),
      pacientes: [{
        id: faker.string.uuid(), nombre: 'Paciente A', genero: 'Masculino', diagnosticos: [],
        medicos: [new MedicoEntity()]
      }],
    };

    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(medico);

    await expect(service.delete(medico.id)).rejects.toHaveProperty('message', 'No se puede eliminar un médico con pacientes asociados');
  });
});
