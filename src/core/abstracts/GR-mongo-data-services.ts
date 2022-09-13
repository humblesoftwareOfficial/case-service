/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Media, MediaDocument } from '../../medias/medias.entity';
import { IDataServices } from '../generics/data.services.abstract';
import { Publication, PublicationDocument } from './../../publication/publication.entity';
import { User, UserDocument } from './../../users/users.entity';
import { MongoGenericRepository } from './GR-mongo-generic-repository';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  users: MongoGenericRepository<User>;
  publications: MongoGenericRepository<Publication>;
  medias: MongoGenericRepository<Media>;

  constructor(
    @InjectModel(User.name)
    private UserRepository: Model<UserDocument | User>,
    @InjectModel(Publication.name)
    private PublicationRepository: Model<PublicationDocument | Publication>,
    @InjectModel(Media.name)
    private MediaRepository: Model<MediaDocument | Media>,
  ) {}

  onApplicationBootstrap() {
    this.users = new MongoGenericRepository<User>(this.UserRepository);
    this.publications = new MongoGenericRepository<Publication>(
      this.PublicationRepository,
      ['user'],
    );
    this.medias = new MongoGenericRepository<Media>(this.MediaRepository);
  }
}
