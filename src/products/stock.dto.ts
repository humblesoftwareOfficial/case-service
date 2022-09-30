/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { IsValidDate } from 'src/shared/date.helpers';


export class NewStockDto {
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  purchasePrice: number;

  @IsOptional()
  @IsString({ message: "Product's unit must be string" })
  unit: string;

  @IsOptional()
  @Validate(IsValidDate)
  expirationDate: string;

  @IsOptional()
  threshold?: number;
}

export class UpdateStockDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  threshold?: number;
}
