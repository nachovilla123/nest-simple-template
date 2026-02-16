import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Contributor } from '../entities/contributor.entity';
import { CreateContributorDto } from '../dtos/create-contributor.dto';
import { UpdateContributorDto } from '../dtos/update-contributor.dto';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorsRepository: Repository<Contributor>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createContributorDto: CreateContributorDto): Promise<Contributor> {
    const contributor = this.contributorsRepository.create(createContributorDto);
    const savedContributor = await this.contributorsRepository.save(contributor);

    this.eventEmitter.emit('webhook.contributor.created', {
      eventType: 'contributor.created',
      data: savedContributor,
      metadata: { timestamp: new Date().toISOString() },
    });

    return savedContributor;
  }

  async findAll(): Promise<Contributor[]> {
    return await this.contributorsRepository.find();
  }

  async findOne(id: string): Promise<Contributor> {
    const contributor = await this.contributorsRepository.findOne({ where: { id } });
    if (!contributor) {
      throw new NotFoundException(`Contributor with ID ${id} not found`);
    }
    return contributor;
  }

  async update(id: string, updateContributorDto: UpdateContributorDto): Promise<Contributor> {
    const contributor = await this.findOne(id);
    Object.assign(contributor, updateContributorDto);
    const updatedContributor = await this.contributorsRepository.save(contributor);

    this.eventEmitter.emit('webhook.contributor.updated', {
      eventType: 'contributor.updated',
      data: updatedContributor,
      metadata: { timestamp: new Date().toISOString() },
    });

    return updatedContributor;
  }

  async remove(id: string): Promise<void> {
    const contributor = await this.findOne(id);
    const contributorData = { ...contributor };
    await this.contributorsRepository.remove(contributor);

    this.eventEmitter.emit('webhook.contributor.deleted', {
      eventType: 'contributor.deleted',
      data: contributorData,
      metadata: { timestamp: new Date().toISOString() },
    });
  }
}
