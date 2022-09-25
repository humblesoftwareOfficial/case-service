import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Result, succeed } from 'src/config/htt-response';
import { IDataServices } from 'src/core/generics/data.services.abstract';
import { Section } from 'src/sections/sections.entity';
import { codeGenerator } from 'src/shared/utils';
import { AddTagsToCategoriesDto, NewCategoriyDto } from './categories.dto';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(private dataServices: IDataServices) {}

  async create(values: NewCategoriyDto[]): Promise<Result> {
    try {
      const creationDate = new Date();
      const allSectionsCode = values.flatMap((c) => c.section);
      const sections = await this.dataServices.section.findAllByCodes(
        allSectionsCode,
        '_id code',
      );
      const createdCategories: any[] = [];
      const errors = [];
      for (let i = 0; i < values.length; i++) {
        const section = sections.find((s) => s.code === values[i].section);
        if (section) {
          const item = {
            ...values[i],
            code: codeGenerator('CAT'),
            createdAt: creationDate,
            lastUpdatedAt: creationDate,
            publications: [],
            section: null,
            tags: [],
          };
          const result = await this.__createCategory(item, section);
          if (result.success) {
            createdCategories.push(result.item);
          } else {
            errors.push({
              value: result.item,
              message: result.message,
            });
          }
        } else {
          errors.push({
            value: {
              label: values[i].label,
              description: values[i].description,
              section: values[i].section,
            },
            message: `Section: ${values[i].section} not found.`,
          });
        }
      }
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          done: createdCategories.flatMap((s) => ({
            code: s.code,
            label: s.label,
            description: s.description,
          })),
          errors,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while creating categories. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addTags(values: AddTagsToCategoriesDto[]): Promise<Result> {
    try {
      const errors = [];
      for (let i = 0; i < values.length; i++) {
        const update = {
          $push: { tags: values[i].tags },
        };
        const result = await this.dataServices.category.update(
          values[i].category,
          update,
        );
        if (!result) {
          errors.push({
            value: values[i],
            message: 'Verifier que cette catégorie existe et réssayer.',
          });
        }
      }
      return succeed({
        code: HttpStatus.OK,
        data: {
          errors,
        },
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(
        `Error while adding tags to categories. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async __createCategory(value: Category, section: Section) {
    try {
      const result = await this.dataServices.category.create({
        ...value,
        section: section['_id'],
      });
      await this.dataServices.section.linkCategoriesToSection(section.code, [
        result['_id'],
      ]);
      const item = {
        code: result.code,
        label: result.label,
        description: result.description,
        section: {
          code: section.code,
          label: section.label,
          description: section.description,
        },
      };
      return {
        success: true,
        item,
        message: '',
      };
    } catch (error) {
      const item = {
        code: value.code,
        label: value.label,
        description: value.description,
        section: {
          code: section.code,
          label: section.label,
          description: section.description,
        },
      };
      if (error?.code === 11000) {
        return {
          success: false,
          item,
          message: `Category with name: ${item.label} Already exists.`,
        };
      }
      return {
        success: false,
        item,
        message: 'Error while creation category',
      };
    }
  }
}
