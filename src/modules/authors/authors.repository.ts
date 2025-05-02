import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';

@Injectable()
export class AuthorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAuthorDto) {
    return this.prisma.author.create({
      data: {
        name: data.name,
        authorInfo: data.authorInfo ? { create: data.authorInfo } : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.author.findMany({
      include: { authorInfo: true },
    });
  }

  findById(id: number) {
    return this.prisma.author.findUnique({
      where: { id },
      include: { authorInfo: true },
    });
  }

  update(id: number, data: UpdateAuthorDto) {
    return this.prisma.author.update({
      where: { id },
      data: {
        name: data.name,
        authorInfo: data.authorInfo
          ? {
              upsert: {
                create: data.authorInfo,
                update: data.authorInfo,
              },
            }
          : undefined,
      },
    });
  }

  delete(id: number) {
    return this.prisma.author.delete({ where: { id } });
  }
}
