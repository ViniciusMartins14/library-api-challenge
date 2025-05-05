import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, MaxLength, ValidateNested } from 'class-validator';
import { BookInfoDto } from './book-info.dto';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  short_description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  author_id?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BookInfoDto)
  book_info?: BookInfoDto;
}
