import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly repo: AuthorsRepository) {}

  create(data: CreateAuthorDto) {
    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    const author = await this.repo.findById(id);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: number, data: UpdateAuthorDto) {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
