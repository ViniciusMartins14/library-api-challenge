// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { Prisma } from '@prisma/client';
import { CreateBookDto } from './dtos/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async createBook(data: CreateBookDto) {
    return this.booksRepository.createBook(data);
  }

  async findPaginatedBooksInStock(page: number, pageSize: number) {
    return this.booksRepository.findBooksInStockPaginated(page, pageSize);
  }

  async searchBooks(keyword: string) {
    return this.booksRepository.searchBooks(keyword);
  }

  async getBookById(id: number) {
    const book = await this.booksRepository.findBookById(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async updateBook(id: number, data: Omit<Prisma.bookUpdateInput, 'sbn'>) {
    const existing = await this.booksRepository.findBookById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cannot update: book with ID ${id} not found`,
      );
    }
    return this.booksRepository.updateBook(id, data);
  }

  async deleteBook(id: number) {
    const existing = await this.booksRepository.findBookById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cannot delete: book with ID ${id} not found`,
      );
    }
    return this.booksRepository.deleteBook(id);
  }
}
