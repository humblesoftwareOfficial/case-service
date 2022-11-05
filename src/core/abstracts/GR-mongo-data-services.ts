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
import { Product, ProductDocument } from 'src/products/products.entity';
import { ProductRepository } from '../repositories/product.repository';
import { ProvisioningRepository } from '../repositories/provisioning.repository';
import { StockProvisioning, StockProvisioningDocument } from '../../products/stock-provisioning.entity';
import { PublicationView, PublicationViewDocument } from '../../publication-view/publication-view.entity';
import { PublicationViewRepository } from '../repositories/publication-view.repository';
import { Reactions, ReactionsDocument } from '../../reactions/reactions.entity';
import { ReactionsRepository } from '../repositories/reactions.repository';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  users: UserRepository<User>;
  publications: PublicationRepository<Publication>;
  medias: MediaRepository<Media>;
  section: SectionRepository<Section>;
  category: CategoryRepository<Category>;
  product: ProductRepository<Product>;
  provisioning: ProvisioningRepository<StockProvisioning>;
  publicationView: PublicationViewRepository<PublicationView>;
  reactions: ReactionsRepository<Reactions>;

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
    @InjectModel(Product.name)
    private productRepository: Model<ProductDocument | Product>,
    @InjectModel(StockProvisioning.name)
    private provisioningRepository: Model<StockProvisioningDocument | StockProvisioning>,

    @InjectModel(PublicationView.name)
    private publicationViewRepository: Model<PublicationViewDocument | PublicationView>,

    @InjectModel(Reactions.name)
    private reactionsepository: Model<ReactionsDocument | Reactions>,
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
    this.product = new ProductRepository<Product>(this.productRepository, [
      'user',
    ]);
    this.provisioning = new ProvisioningRepository<StockProvisioning>(this.provisioningRepository, [
      'user',
      'product',
    ]);
    this.publicationView = new PublicationViewRepository<PublicationView>(this.publicationViewRepository);
    this.reactions = new ReactionsRepository<Reactions>(this.reactionsepository);
  }
}
