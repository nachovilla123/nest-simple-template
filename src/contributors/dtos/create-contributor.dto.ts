import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateContributorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;
}
