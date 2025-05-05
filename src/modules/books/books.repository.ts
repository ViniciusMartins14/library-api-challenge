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
        bookInfo: data.book_info
          ? {
              create: {
                publisher: data.book_info.publisher,
                edition: data.book_info.edition,
                pages: data.book_info.pages,
                language: data.book_info.language,
                publication_date: data.book_info.publication_date
                  ? new Date(data.book_info.publication_date)
                  : undefined,
              },
            }
          : undefined,
      },
      include: {
        author: true,
        bookInfo: true,
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

  async updateBook(id: number, data: Prisma.bookUpdateInput) {
    const { book_info, ...bookData } = data as any;

    return this.prisma.book.update({
      where: { id },
      data: {
        ...bookData,
        bookInfo: book_info
          ? {
              upsert: {
                create: {
                  publisher: book_info.publisher,
                  edition: book_info.edition,
                  pages: book_info.pages,
                  language: book_info.language,
                  publication_date: book_info.publication_date
                    ? new Date(book_info.publication_date)
                    : undefined,
                },
                update: {
                  publisher: book_info.publisher,
                  edition: book_info.edition,
                  pages: book_info.pages,
                  language: book_info.language,
                  publication_date: book_info.publication_date
                    ? new Date(book_info.publication_date)
                    : undefined,
                },
              },
            }
          : undefined,
      },
      include: {
        author: true,
        bookInfo: true,
      },
    });
  }

  async deleteBook(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
