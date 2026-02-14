import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonsController } from './controllers/persons.controller';
import { PersonsService } from './services/persons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
