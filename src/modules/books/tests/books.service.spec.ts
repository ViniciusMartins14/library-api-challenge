import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../books.service';
import { BooksRepository } from '../books.repository';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: BooksRepository;

  const mockBooksRepository = {
    findBooksInStockPaginated: jest.fn(),
    searchBooks: jest.fn(),
    findBookById: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BooksRepository,
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<BooksRepository>(BooksRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findPaginatedBooksInStock', () => {
    it('should return paginated books', async () => {
      const expectedResult = {
        books: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      };
      mockBooksRepository.findBooksInStockPaginated.mockResolvedValue(
        expectedResult,
      );

      const result = await service.findPaginatedBooksInStock(1, 10);

      expect(result).toEqual(expectedResult);
      expect(repository.findBooksInStockPaginated).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('searchBooks', () => {
    it('should return matching books', async () => {
      const expectedBooks = [{ id: 1, name: 'Book A' }];
      mockBooksRepository.searchBooks.mockResolvedValue(expectedBooks);

      const result = await service.searchBooks('book');

      expect(result).toEqual(expectedBooks);
      expect(repository.searchBooks).toHaveBeenCalledWith('book');
    });
  });

  describe('getBookById', () => {
    it('should return a book if it exists', async () => {
      const book = { id: 1, name: 'Book A' };
      mockBooksRepository.findBookById.mockResolvedValue(book);

      const result = await service.getBookById(1);

      expect(result).toEqual(book);
      expect(repository.findBookById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockBooksRepository.findBookById.mockResolvedValue(null);

      await expect(service.getBookById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBook', () => {
    it('should update a book if it exists', async () => {
      const updatedBook = { id: 1, name: 'Updated Book' };
      const updateData = { name: 'Updated Book' };

      mockBooksRepository.findBookById.mockResolvedValue({ id: 1 });
      mockBooksRepository.updateBook.mockResolvedValue(updatedBook);

      const result = await service.updateBook(1, updateData);

      expect(result).toEqual(updatedBook);
      expect(repository.updateBook).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockBooksRepository.findBookById.mockResolvedValue(null);

      await expect(service.updateBook(1, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteBook', () => {
    it('should delete a book if it exists', async () => {
      mockBooksRepository.findBookById.mockResolvedValue({ id: 1 });
      mockBooksRepository.deleteBook.mockResolvedValue({ id: 1 });

      const result = await service.deleteBook(1);

      expect(result).toEqual({ id: 1 });
      expect(repository.deleteBook).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockBooksRepository.findBookById.mockResolvedValue(null);

      await expect(service.deleteBook(999)).rejects.toThrow(NotFoundException);
    });
  });
});
