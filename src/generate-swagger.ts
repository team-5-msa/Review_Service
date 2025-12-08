import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateSwaggerJson() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Review Service API')
    .setDescription('The Review Service API for performance reviews')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('https://review-service-zeta.vercel.app', 'Production')
    .addServer('http://localhost:3000', 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // public 디렉토리 생성
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // swagger.json 저장
  const swaggerPath = path.join(publicDir, 'swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2));
  console.log(`✅ Swagger JSON generated at ${swaggerPath}`);

  await app.close();
}

generateSwaggerJson().catch((err) => {
  console.error('Error generating Swagger JSON:', err);
  process.exit(1);
});
