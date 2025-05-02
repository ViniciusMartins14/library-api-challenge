import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorsController],
  providers: [
    AuthorsService,
    AuthorsRepository,
    makeCounterProvider({
      name: 'authors_requests_total',
      help: 'Contador de requisições ao módulo de autores',
      labelNames: ['method', 'route'],
    }),
  ],
})
export class AuthorsModule {}
