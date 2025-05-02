
import { IsString } from 'class-validator';

export class SearchBooksDto {
  @IsString()
  keyword: string;
}
