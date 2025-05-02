import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBookDto } from './dtos/create-book.dto';

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBook(data: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        sbn: data.sbn,
        name: data.name,
        short_description: data.short_description,
        stock: data.stock,
        author: {
          connect: { id: data.author_id },
        },
      },
    });
  }

  async findBooksInStockPaginated(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where: { stock: { gt: 0 } },
        include: { author: true },
        skip,
        take: pageSize,
      }),
      this.prisma.book.count({
        where: { stock: { gt: 0 } },
      }),
    ]);

    return {
      books,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async searchBooks(keyword: string) {
    const normalized = keyword.toLowerCase();

    return this.prisma.book.findMany({
      where: {
        OR: [
          { name: { contains: normalized } },
          { short_description: { contains: normalized } },
        ],
      },
      include: { author: true },
    });
  }

  async findBookById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          include: { authorInfo: true },
        },
        bookInfo: true,
      },
    });
  }

  async updateBook(id: number, data: Omit<Prisma.bookUpdateInput, 'sbn'>) {
    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async deleteBook(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
