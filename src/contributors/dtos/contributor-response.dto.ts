import { Contributor } from '../entities/contributor.entity';

export class ContributorResponseDto {
  id: string;
  name: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(contributor: Contributor): ContributorResponseDto {
    return {
      id: contributor.id,
      name: contributor.name,
      surname: contributor.surname,
      createdAt: contributor.createdAt,
      updatedAt: contributor.updatedAt,
    };
  }
}
