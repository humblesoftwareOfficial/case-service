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
import { SectionRepository } from '../repositories/section.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { Section } from '../../sections/sections.entity';
import { Category } from '../../categories/categories.entity';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../../products/products.entity';
import { ProvisioningRepository } from '../repositories/provisioning.repository';
import { StockProvisioning } from '../../products/stock-provisioning.entity';
import { PublicationViewRepository } from '../repositories/publication-view.repository';
import { PublicationView } from '../../publication-view/publication-view.entity';

export abstract class IDataServices {
  abstract users: UserRepository<User | UserDocument>;

  abstract publications: PublicationRepository<Publication>;

  abstract medias: MediaRepository<Media>;

  abstract section: SectionRepository<Section>;

  abstract category: CategoryRepository<Category>;

  abstract product: ProductRepository<Product>;

  abstract provisioning: ProvisioningRepository<StockProvisioning>;

  abstract publicationView: PublicationViewRepository<PublicationView>;
}
