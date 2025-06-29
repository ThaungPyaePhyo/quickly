import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BidModule } from './bid/bid.module';
import { CategoryModule } from './category/category.module';
import { RatingModule } from './rating/rating.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [JobModule, UserModule, AuthModule, BidModule, CategoryModule, RatingModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
