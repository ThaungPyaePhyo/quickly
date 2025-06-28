import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}