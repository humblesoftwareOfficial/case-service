/* eslint-disable prettier/prettier */
import { CategoryEntity } from './Category';
import { DefaultAttributesEntity } from './DefaultAttributes';
import { MediaEntity } from './Media';
import { PublicationEntity } from './Publication';
import { SectionEntity } from './Section';
import { StockProvisioningEntity } from './StockProvisioning';
import { UserEntity } from './User';

class StockEntity {
  quantity: number;
  purchasePrice: number;
  unit: string;
  expirationDate: Date;
  threshold?: number;
}

class PriceHistoryEntity {
  price: number;
  date: Date;
  week: number;
  month: number;
  year: number;
  isInPromotion?: boolean;
}

export class ProductColorEntity {
  value: string;
  media: MediaEntity;
}

export class ProductEntity extends DefaultAttributesEntity {
  label: string;
  description: string;
  price: number;
  priceHistory: PriceHistoryEntity[];
  colors: ProductColorEntity[];
  stock: StockEntity;
  user: UserEntity;
  section: SectionEntity;
  category: CategoryEntity;
  tags: string[];
  media: MediaEntity[];
  publications: PublicationEntity[];
  week: number;
  month: number;
  year: number;
  isInPromotion?: boolean;
  provisions?: StockProvisioningEntity[]
}
