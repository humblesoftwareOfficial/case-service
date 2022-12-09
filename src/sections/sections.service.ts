/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Result, succeed } from 'src/config/htt-response';
import { IDataServices } from 'src/core/generics/data.services.abstract';
import { codeGenerator, ErrorMessages } from 'src/shared/utils';
import { NewSectionDto } from './section.dto';
import { Section } from './sections.entity';

@Injectable()
export class SectionsService {
  constructor(private dataServices: IDataServices) {}

  async create(values: NewSectionDto[]): Promise<Result> {
    try {
      const creationDate = new Date();
      const sections = values.flatMap((s) => ({
        ...s,
        code: codeGenerator('SEC'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        publications: [],
        categories: [],
      }));
      const createdSections: Section[] = [];
      const errors = [];
      for (let i = 0; i < sections.length; i++) {
        try {
          const result = await this.dataServices.section.create(sections[i]);
          createdSections.push(result);
        } catch (error) {
          const value = {
            label: sections[i].label,
            description: sections[i].description,
          };
          if (error?.code === 11000) {
            errors.push({
              value,
              message: `Section with name: ${sections[i].label} already exist`,
            });
          } else {
            errors.push({
              value,
              message: `Error while creating section.`,
            });
          }
        }
      }
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          done: createdSections.flatMap((s) => ({
            code: s.code,
            label: s.label,
            description: s.description,
          })),
          errors,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while creating section(s). Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSections(): Promise<Result> {
    try {
      return succeed({
        code: HttpStatus.OK,
        data: await this.dataServices.section.listSections(),
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
