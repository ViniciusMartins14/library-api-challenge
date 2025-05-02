import {
  Controller,
  Get,
  Query,
  Param,
  Put,
  Body,
  Delete,
  ParseIntPipe,
  HttpCode,
  Post,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dtos/update-book.dto';
import { SearchBooksDto } from './dtos/search-books.dto';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { CreateBookDto } from './dtos/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @InjectMetric('books_requests_total')
    private readonly requestsCounter: Counter<string>,
  ) {}

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    this.requestsCounter.inc({ method: 'POST', route: '/books' });

    return this.booksService.createBook(createBookDto);
  }

  @Get()
  async findPaginatedBooks(@Query() query: PaginationQueryDto) {
    this.requestsCounter.inc({ method: 'GET', route: '/books' });

    const { page, pageSize } = query;
    return this.booksService.findPaginatedBooksInStock(page, pageSize);
  }

  @Get('search')
  async searchBooks(@Query() query: SearchBooksDto) {
    this.requestsCounter.inc({ method: 'GET', route: '/books/search' });

    return this.booksService.searchBooks(query.keyword);
  }

  @Get(':id')
  async getBookById(@Param('id', ParseIntPipe) id: number) {
    this.requestsCounter.inc({ method: 'GET', route: '/books/:id' });

    return this.booksService.getBookById(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    this.requestsCounter.inc({ method: 'PUT', route: '/books/:id' });

    return this.booksService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    this.requestsCounter.inc({ method: 'DELETE', route: '/books/:id' });

    await this.booksService.deleteBook(id);
  }
}
