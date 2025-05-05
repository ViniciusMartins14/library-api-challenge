import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookInfoDto } from './book-info.dto';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sbn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  short_description?: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  author_id: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BookInfoDto)
  book_info?: BookInfoDto;
}
