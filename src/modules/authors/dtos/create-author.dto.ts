import {
  IsString,
  MaxLength,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateAuthorInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;
}

export class CreateAuthorDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAuthorInfoDto)
  authorInfo?: CreateAuthorInfoDto;
}
