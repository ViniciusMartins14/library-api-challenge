import { Test, TestingModule } from '@nestjs/testing';
import { BooksRepository } from '../books.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaMockFactory } from './mocks/prisma.service.mock';

describe('BooksRepository', () => {
  let repository: BooksRepository;
  let prisma: ReturnType<typeof prismaMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksRepository,
        {
          provide: PrismaService,
          useFactory: prismaMockFactory,
        },
      ],
    }).compile();

    repository = module.get<BooksRepository>(BooksRepository);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findBooksInStockPaginated', () => {
    it('should return paginated books in stock', async () => {
      prisma.book.findMany.mockResolvedValue([
        { id: 1, name: 'Book A' },
      ] as any);
      prisma.book.count.mockResolvedValue(10);

      const result = await repository.findBooksInStockPaginated(1, 5);

      expect(prisma.book.findMany).toHaveBeenCalledWith({
        where: { stock: { gt: 0 } },
        include: { author: true },
        skip: 0,
        take: 5,
      });
      expect(prisma.book.count).toHaveBeenCalledWith({
        where: { stock: { gt: 0 } },
      });
      expect(result.total).toBe(10);
      expect(result.books.length).toBe(1);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('searchBooks', () => {
    it('should search books by keyword using lowercase', async () => {
      prisma.book.findMany.mockResolvedValue([
        { id: 1, name: 'Clean Code' },
      ] as any);

      const result = await repository.searchBooks('clean');

      expect(prisma.book.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'clean' } },
            { short_description: { contains: 'clean' } },
          ],
        },
        include: { author: true },
      });
      expect(result[0].name).toBe('Clean Code');
    });
  });

  describe('findBookById', () => {
    it('should return a book with full details', async () => {
      prisma.book.findUnique.mockResolvedValue({
        id: 1,
        name: 'Book X',
        author: { name: 'Author X', authorInfo: {} },
        bookInfo: {},
      } as any);

      const result = await repository.findBookById(1);

      expect(prisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          author: { include: { authorInfo: true } },
          bookInfo: true,
        },
      });

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Book X');
    });
  });

  describe('updateBook', () => {
    it('should update a book (excluding SBN)', async () => {
      prisma.book.update.mockResolvedValue({
        id: 1,
        name: 'Updated Book',
      } as any);

      const result = await repository.updateBook(1, { name: 'Updated Book' });

      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Book' },
        include: {
          author: true,
          bookInfo: true,
        },
      });

      expect(result.name).toBe('Updated Book');
    });
  });

  describe('deleteBook', () => {
    it('should delete a book by ID', async () => {
      prisma.book.delete.mockResolvedValue({ id: 1 } as any);

      const result = await repository.deleteBook(1);

      expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.id).toBe(1);
    });
  });

  describe('createBook', () => {
    it('should create a book with valid data', async () => {
      const bookData = {
        sbn: '12345',
        name: 'New Book',
        short_description: 'A test book',
        stock: 5,
        author_id: 1,
      };

      prisma.book.create.mockResolvedValue({ id: 1, ...bookData } as any);

      const result = await repository.createBook(bookData);

      expect(prisma.book.create).toHaveBeenCalledWith({
        data: {
          sbn: '12345',
          name: 'New Book',
          short_description: 'A test book',
          stock: 5,
          author: {
            connect: { id: 1 },
          },
          bookInfo: undefined,
        },
        include: {
          author: true,
          bookInfo: true,
        },
      });

      expect(result.id).toBe(1);
    });
  });
});
