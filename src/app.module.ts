import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PersonsModule } from './persons/persons.module';
import { ContributorsModule } from './contributors/contributors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    PersonsModule,
    ContributorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
