import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRaw() {
  const authors = [
    {
      name: 'Machado de Assis',
      bio: 'Escritor brasileiro do século XIX',
      birthdate: new Date('1839-06-21'),
    },
    {
      name: 'Clarice Lispector',
      bio: 'Romancista e jornalista brasileira',
      birthdate: new Date('1920-12-10'),
    },
    {
      name: 'George Orwell',
      bio: 'Autor britânico, autor de 1984 e Animal Farm',
      birthdate: new Date('1903-06-25'),
    },
  ];

  for (const author of authors) {
    const createdAuthor = await prisma.author.upsert({
      where: { name: author.name },
      update: {},
      create: { name: author.name },
    });

    await prisma.author_info.upsert({
      where: { author_id: createdAuthor.id },
      update: {
        bio: author.bio,
        birthdate: author.birthdate,
      },
      create: {
        author_id: createdAuthor.id,
        bio: author.bio,
        birthdate: author.birthdate,
      },
    });
  }

  const books = [
    {
      sbn: 'SBN001',
      name: 'Dom Casmurro',
      stock: 5,
      author: 'Machado de Assis',
      desc: 'Romance psicológico',
    },
    {
      sbn: 'SBN002',
      name: 'Memórias Póstumas de Brás Cubas',
      stock: 3,
      author: 'Machado de Assis',
      desc: 'Narrativa pós-morte',
    },
    {
      sbn: 'SBN007',
      name: 'Quincas Borba',
      stock: 4,
      author: 'Machado de Assis',
      desc: 'Crítica filosófica e social',
    },
    {
      sbn: 'SBN008',
      name: 'Helena',
      stock: 2,
      author: 'Machado de Assis',
      desc: 'Romance sentimental',
    },
    {
      sbn: 'SBN003',
      name: 'A Hora da Estrela',
      stock: 7,
      author: 'Clarice Lispector',
    },
    {
      sbn: 'SBN004',
      name: 'Perto do Coração Selvagem',
      stock: 2,
      author: 'Clarice Lispector',
    },
    {
      sbn: 'SBN009',
      name: 'Laços de Família',
      stock: 6,
      author: 'Clarice Lispector',
      desc: 'Coletânea de contos sobre o cotidiano e a introspecção',
    },
    {
      sbn: 'SBN010',
      name: 'O Lustre',
      stock: 3,
      author: 'Clarice Lispector',
      desc: 'Narrativa existencial sobre a infância e o amadurecimento',
    },
    { sbn: 'SBN005', name: '1984', stock: 10, author: 'George Orwell' },
    { sbn: 'SBN006', name: 'Animal Farm', stock: 8, author: 'George Orwell' },
    {
      sbn: 'SBN011',
      name: 'Down and Out in Paris and London',
      stock: 5,
      author: 'George Orwell',
      desc: 'Relato semiautobiográfico sobre a pobreza',
    },
    {
      sbn: 'SBN012',
      name: 'Homage to Catalonia',
      stock: 4,
      author: 'George Orwell',
      desc: 'Experiência de Orwell na Guerra Civil Espanhola',
    },
  ];

  for (const book of books) {
    const author = await prisma.author.findUnique({
      where: { name: book.author },
    });

    if (!author) continue;

    await prisma.book.upsert({
      where: { sbn: book.sbn },
      update: {},
      create: {
        sbn: book.sbn,
        name: book.name,
        stock: book.stock,
        short_description: book.desc ?? null,
        author_id: author.id,
      },
    });
  }

  console.log('🌱 Seed executado com sucesso usando DateTime e Prisma ORM!');
}

seedRaw();
