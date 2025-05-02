import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly service: AuthorsService,
    @InjectMetric('authors_requests_total')
    private readonly counter: Counter<string>,
  ) {}

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    this.counter.inc({ method: 'POST', route: '/authors' });
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    this.counter.inc({ method: 'GET', route: '/authors' });
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.counter.inc({ method: 'GET', route: '/authors/:id' });
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuthorDto) {
    this.counter.inc({ method: 'PUT', route: '/authors/:id' });
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.counter.inc({ method: 'DELETE', route: '/authors/:id' });
    return this.service.delete(id);
  }
}
