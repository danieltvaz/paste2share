import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(
    `App listening on PORT 3001 for the environment ${process.env.NODE_ENV}`,
  );
}
bootstrap();
