import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './entities/contributor.entity';
import { ContributorsController } from './controllers/contributors.controller';
import { ContributorsService } from './services/contributors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor])],
  controllers: [ContributorsController],
  providers: [ContributorsService],
  exports: [ContributorsService],
})
export class ContributorsModule {}
