/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsPhoneNumber, Length } from 'class-validator';

export class MedicoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly especialidad: string;

  @IsPhoneNumber('US')
  @IsNotEmpty()
  @Length(7, 15)
  readonly telefono: string;
}
