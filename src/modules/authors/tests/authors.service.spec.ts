import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../authors.service';
import { AuthorsRepository } from '../authors.repository';
import { NotFoundException } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repo: AuthorsRepository;

  const mockRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: AuthorsRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get(AuthorsService);
    repo = module.get(AuthorsRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create an author', async () => {
    mockRepo.create.mockResolvedValue({ id: 1, name: 'A' });
    const result = await service.create({ name: 'A' });
    expect(result.name).toBe('A');
  });

  it('should return all authors', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1, name: 'A' }]);
    const result = await service.findAll();
    expect(result.length).toBe(1);
  });

  it('should return one author if found', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, name: 'A' });
    const result = await service.findById(1);
    expect(result.id).toBe(1);
  });

  it('should throw if author not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should update an author', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    mockRepo.update.mockResolvedValue({ id: 1, name: 'B' });
    const result = await service.update(1, { name: 'B' });
    expect(result.name).toBe('B');
  });

  it('should delete an author', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    mockRepo.delete.mockResolvedValue({ id: 1 });
    const result = await service.delete(1);
    expect(result.id).toBe(1);
  });
});
