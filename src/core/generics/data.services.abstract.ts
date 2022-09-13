/* eslint-disable prettier/prettier */
// import { Media } from '../entities/Media';
// import { PublicationEntity } from '../entities/Publication';
// import { UserEntity } from '../entities/User';
import { Media } from '../../medias/medias.entity';
import { Publication } from '../../publication/publication.entity';
import { User } from '../../users/users.entity';
import { IGenericRepository } from './generic.repository.abstract';

export abstract class IDataServices {
  abstract users: IGenericRepository<User>;

  abstract publications: IGenericRepository<Publication>;

  abstract medias: IGenericRepository<Media>;
}
