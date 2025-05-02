import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthorsModule } from './modules/authors/authors.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
          },
        },
      },
    }),
    TerminusModule,
    BooksModule,
    AuthorsModule,
    HealthModule,
    MetricsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
