import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  providers: [
    BooksService,
    BooksRepository,
    makeCounterProvider({
      name: 'books_requests_total',
      help: 'Contador de requisições para o módulo de livros',
      labelNames: ['method', 'route'],
    }),
  ],
  exports: [BooksService],
  controllers: [BooksController],
  imports: [PrismaModule],
})
export class BooksModule {}
