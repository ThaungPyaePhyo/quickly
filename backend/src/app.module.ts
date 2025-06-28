import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BidModule } from './bid/bid.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [JobModule, UserModule, AuthModule, BidModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
