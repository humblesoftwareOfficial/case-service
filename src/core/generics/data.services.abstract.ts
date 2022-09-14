/* eslint-disable prettier/prettier */
// import { Media } from '../entities/Media';
// import { PublicationEntity } from '../entities/Publication';
// import { UserEntity } from '../entities/User';
import { Media } from '../../medias/medias.entity';
import { Publication } from '../../publication/publication.entity';
import { User, UserDocument } from '../../users/users.entity';
import { UserRepository } from '../repositories/user.repository';
import { PublicationRepository } from '../repositories/publication.repository';
import { MediaRepository } from '../repositories/media.repository';

export abstract class IDataServices {
  abstract users: UserRepository<User | UserDocument>;

  abstract publications: PublicationRepository<Publication>;

  abstract medias: MediaRepository<Media>;
}
