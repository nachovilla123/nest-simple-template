import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contributor } from '../entities/contributor.entity';
import { CreateContributorDto } from '../dtos/create-contributor.dto';
import { UpdateContributorDto } from '../dtos/update-contributor.dto';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorsRepository: Repository<Contributor>,
  ) {}

  async create(createContributorDto: CreateContributorDto): Promise<Contributor> {
    const contributor = this.contributorsRepository.create(createContributorDto);
    return await this.contributorsRepository.save(contributor);
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
    return await this.contributorsRepository.save(contributor);
  }

  async remove(id: string): Promise<void> {
    const contributor = await this.findOne(id);
    await this.contributorsRepository.remove(contributor);
  }
}
