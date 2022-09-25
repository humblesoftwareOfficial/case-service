/* eslint-disable prettier/prettier */
import { CategoryEntity } from './Category';
import { DefaultAttributesEntity } from './DefaultAttributes';
import { PublicationEntity } from './Publication';

export class SectionEntity extends DefaultAttributesEntity {
  label: string;
  description: string;
  categories: CategoryEntity[];
  publications: PublicationEntity[];
}
