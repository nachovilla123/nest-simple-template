import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { CreatePersonDto } from '../dtos/create-person.dto';
import { UpdatePersonDto } from '../dtos/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personsRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = this.personsRepository.create(createPersonDto);
    return await this.personsRepository.save(person);
  }

  async findAll(): Promise<Person[]> {
    return await this.personsRepository.find();
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.personsRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    Object.assign(person, updatePersonDto);
    return await this.personsRepository.save(person);
  }

  async remove(id: string): Promise<void> {
    const person = await this.findOne(id);
    await this.personsRepository.remove(person);
  }
}
