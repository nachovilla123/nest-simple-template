import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContributorsService } from '../services/contributors.service';
import { CreateContributorDto } from '../dtos/create-contributor.dto';
import { UpdateContributorDto } from '../dtos/update-contributor.dto';
import { ContributorResponseDto } from '../dtos/contributor-response.dto';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContributorDto: CreateContributorDto): Promise<ContributorResponseDto> {
    const contributor = await this.contributorsService.create(createContributorDto);
    return ContributorResponseDto.fromEntity(contributor);
  }

  @Get()
  async findAll(): Promise<ContributorResponseDto[]> {
    const contributors = await this.contributorsService.findAll();
    return contributors.map(ContributorResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ContributorResponseDto> {
    const contributor = await this.contributorsService.findOne(id);
    return ContributorResponseDto.fromEntity(contributor);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContributorDto: UpdateContributorDto,
  ): Promise<ContributorResponseDto> {
    const contributor = await this.contributorsService.update(id, updateContributorDto);
    return ContributorResponseDto.fromEntity(contributor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.contributorsService.remove(id);
  }
}
