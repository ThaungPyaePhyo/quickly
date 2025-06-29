import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import redisClient from './config/redis';

const RedisStore = connectRedis(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});


  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'password',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5001, '0.0.0.0');
}
bootstrap();