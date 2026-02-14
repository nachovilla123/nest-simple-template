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
import { PersonsService } from '../services/persons.service';
import { CreatePersonDto } from '../dtos/create-person.dto';
import { UpdatePersonDto } from '../dtos/update-person.dto';
import { PersonResponseDto } from '../dtos/person-response.dto';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
    const person = await this.personsService.create(createPersonDto);
    return PersonResponseDto.fromEntity(person);
  }

  @Get()
  async findAll(): Promise<PersonResponseDto[]> {
    const persons = await this.personsService.findAll();
    return persons.map(PersonResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PersonResponseDto> {
    const person = await this.personsService.findOne(id);
    return PersonResponseDto.fromEntity(person);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    const person = await this.personsService.update(id, updatePersonDto);
    return PersonResponseDto.fromEntity(person);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.personsService.remove(id);
  }
}
