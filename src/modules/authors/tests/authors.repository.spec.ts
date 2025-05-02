import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsRepository } from '../authors.repository';
import { PrismaService } from '../../../prisma/prisma.service';

describe('AuthorsRepository', () => {
  let repository: AuthorsRepository;
  let prisma: ReturnType<typeof prismaMockFactory>;

  const prismaMockFactory = () => ({
    author: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsRepository,
        {
          provide: PrismaService,
          useFactory: prismaMockFactory,
        },
      ],
    }).compile();

    repository = module.get(AuthorsRepository);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create an author with info', async () => {
    prisma.author.create.mockResolvedValue({
      id: 1,
      name: 'Test Author',
    } as any);

    const result = await repository.create({
      name: 'Test Author',
      authorInfo: { bio: 'Bio', birthdate: '2000-01-01T00:00:00Z' },
    });

    expect(prisma.author.create).toHaveBeenCalled();
    expect(result.name).toBe('Test Author');
  });

  it('should find all authors', async () => {
    prisma.author.findMany.mockResolvedValue([{ id: 1, name: 'A' }] as any);
    const result = await repository.findAll();
    expect(result.length).toBe(1);
  });

  it('should find author by id', async () => {
    prisma.author.findUnique.mockResolvedValue({ id: 1, name: 'X' } as any);
    const result = await repository.findById(1);

    expect(result).not.toBeNull();
    expect(result!.name).toBe('X');
  });

  it('should update an author', async () => {
    prisma.author.update.mockResolvedValue({ id: 1, name: 'Updated' } as any);
    const result = await repository.update(1, { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should delete an author', async () => {
    prisma.author.delete.mockResolvedValue({ id: 1 } as any);
    const result = await repository.delete(1);
    expect(result.id).toBe(1);
  });
});
