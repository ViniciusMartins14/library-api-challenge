import {
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateAuthorInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;
}

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAuthorInfoDto)
  authorInfo?: UpdateAuthorInfoDto;
}
