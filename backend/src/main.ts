import { NextFunction, Response } from 'express';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use((_, res: Response, next: NextFunction) => {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://paste2share-api.danieltostes.dev',
    );
    next();
  });

  await app.listen(
    `App listening on PORT 3001 for the environment ${process.env.NODE_ENV}`,
  );
}
bootstrap();
