/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Media, MediaDocument } from '../../medias/medias.entity';
import { IDataServices } from '../generics/data.services.abstract';
import {
  Publication,
  PublicationDocument,
} from './../../publication/publication.entity';
import { User } from './../../users/users.entity';
import { UserRepository } from '../repositories/user.repository';
import { MediaRepository } from '../repositories/media.repository';
import { PublicationRepository } from '../repositories/publication.repository';
import { Category, CategoryDocument } from '../../categories/categories.entity';
import { Section, SectionDocument } from '../../sections/sections.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { SectionRepository } from '../repositories/section.repository';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  users: UserRepository<User>;
  publications: PublicationRepository<Publication>;
  medias: MediaRepository<Media>;
  section: SectionRepository<Section>;
  category: CategoryRepository<Category>;

  constructor(
    @InjectModel(User.name)
    private userRepository: Model<User>,
    @InjectModel(Publication.name)
    private publicationRepository: Model<PublicationDocument | Publication>,
    @InjectModel(Media.name)
    private mediaRepository: Model<MediaDocument | Media>,

    @InjectModel(Section.name)
    private sectionRepository: Model<SectionDocument | Section>,
    @InjectModel(Category.name)
    private categoryRepository: Model<CategoryDocument | Category>,
  ) {}

  onApplicationBootstrap() {
    this.users = new UserRepository<User>(this.userRepository);
    this.publications = new PublicationRepository<Publication>(
      this.publicationRepository,
      ['user'],
    );
    this.medias = new MediaRepository<Media>(this.mediaRepository);
    this.section = new SectionRepository<Section>(this.sectionRepository, [
      'publications',
    ]);
    this.category = new CategoryRepository<Category>(this.categoryRepository, [
      'section',
      'publications',
    ]);
  }
}
