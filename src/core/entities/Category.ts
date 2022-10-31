/* eslint-disable prettier/prettier */
import { DefaultAttributesEntity } from './DefaultAttributes';
import { PublicationEntity } from './Publication';
import { SectionEntity } from './Section';

export class CategoryEntity extends DefaultAttributesEntity {
  label: string;
  description: string;
  section: SectionEntity;
  publications: PublicationEntity[];
  tags: string[];
}
