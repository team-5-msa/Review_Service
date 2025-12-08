import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Review Service API')
    .setDescription('The Review Service API for performance reviews')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer(
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.VERCEL_URL || process.env.API_URL || 'localhost:3000'}`
        : 'http://localhost:3000',
      process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Review Service running on ${process.env.PORT ?? 3000} with Swagger at /api`,
    );
  });
}

void bootstrap();
