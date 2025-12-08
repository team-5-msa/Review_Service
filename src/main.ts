import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // API 경로 프리픽스 설정
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Review Service API')
    .setDescription('The Review Service API for performance reviews')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // Swagger 경로를 /api/docs로 설정 (Vercel 호환)
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Review Service running on port ${port}`);
    console.log(`API Documentation: http://localhost:${port}/api/docs`);
  });
}

void bootstrap();
