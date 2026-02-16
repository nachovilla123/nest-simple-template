import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Person } from '../entities/person.entity';
import { CreatePersonDto } from '../dtos/create-person.dto';
import { UpdatePersonDto } from '../dtos/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personsRepository: Repository<Person>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = this.personsRepository.create(createPersonDto);
    const savedPerson = await this.personsRepository.save(person);

    this.eventEmitter.emit('webhook.person.created', {
      eventType: 'person.created',
      data: savedPerson,
      metadata: { timestamp: new Date().toISOString() },
    });

    return savedPerson;
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
    const updatedPerson = await this.personsRepository.save(person);

    this.eventEmitter.emit('webhook.person.updated', {
      eventType: 'person.updated',
      data: updatedPerson,
      metadata: { timestamp: new Date().toISOString() },
    });

    return updatedPerson;
  }

  async remove(id: string): Promise<void> {
    const person = await this.findOne(id);
    const personData = { ...person };
    await this.personsRepository.remove(person);

    this.eventEmitter.emit('webhook.person.deleted', {
      eventType: 'person.deleted',
      data: personData,
      metadata: { timestamp: new Date().toISOString() },
    });
  }
}
