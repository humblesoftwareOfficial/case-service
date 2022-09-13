/* eslint-disable prettier/prettier */
// import { Media } from '../entities/Media';
// import { PublicationEntity } from '../entities/Publication';
// import { UserEntity } from '../entities/User';
import { Media } from '../../medias/medias.entity';
import { Publication } from '../../publication/publication.entity';
import { User, UserDocument } from '../../users/users.entity';
import { IGenericRepository } from './generic.repository.abstract';
import { UserRepository } from '../repositories/user.repository';

export abstract class IDataServices {
  abstract users: UserRepository<User | UserDocument>;

  abstract publications: IGenericRepository<Publication>;

  abstract medias: IGenericRepository<Media>;
}
