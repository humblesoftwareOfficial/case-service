/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Media, MediaDocument } from '../../medias/medias.entity';
import { IDataServices } from '../generics/data.services.abstract';
import { Publication, PublicationDocument } from './../../publication/publication.entity';
import { User, UserDocument } from './../../users/users.entity';
import { MongoGenericRepository } from './GR-mongo-generic-repository';
import { UserRepository } from '../repositories/user.repository';
import { MediaRepository } from '../repositories/media.repository';
import { PublicationRepository } from '../repositories/publication.repository';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  users: UserRepository<User>;
  publications: PublicationRepository<Publication>;
  medias: MediaRepository<Media>;

  constructor(
    @InjectModel(User.name)
    private userRepository: Model<User>,
    @InjectModel(Publication.name)
    private publicationRepository: Model<PublicationDocument | Publication>,
    @InjectModel(Media.name)
    private mediaRepository: Model<MediaDocument | Media>,
  ) {}

  onApplicationBootstrap() {
    this.users = new UserRepository<User>(this.userRepository);
    this.publications = new PublicationRepository<Publication>(
      this.publicationRepository,
      ['user'],
    );
    this.medias = new MediaRepository<Media>(this.mediaRepository);
  }
}
