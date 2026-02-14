import { Person } from '../entities/person.entity';

export class PersonResponseDto {
  id: string;
  name: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(person: Person): PersonResponseDto {
    return {
      id: person.id,
      name: person.name,
      surname: person.surname,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };
  }
}
