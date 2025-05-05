import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class BookInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  publisher?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  edition?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pages?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  language?: string;

  @IsOptional()
  @IsDateString()
  publication_date?: string;
}
