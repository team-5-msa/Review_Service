import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import express, { Application } from 'express';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

let cachedApp: INestApplication | null = null;

async function initializeApp(): Promise<Application> {
  if (cachedApp) {
    const adapter = cachedApp.getHttpAdapter();
    return adapter.getInstance() as Application;
  }

  const expressApp = express();

  // Serve static files from public directory
  const publicDir = path.join(__dirname, '..', 'public');
  expressApp.use(express.static(publicDir));

  // Manual handling for swagger files
  expressApp.get('/swagger-ui.html', (req, res) => {
    const filePath = path.join(publicDir, 'swagger-ui.html');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(fs.readFileSync(filePath, 'utf-8'));
    } else {
      res.status(404).send('Not Found');
    }
  });

  expressApp.get('/swagger.json', (req, res) => {
    const filePath = path.join(publicDir, 'swagger.json');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/json');
      res.send(fs.readFileSync(filePath, 'utf-8'));
    } else {
      res.status(404).send('Not Found');
    }
  });

  cachedApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  cachedApp.enableCors({
    origin: true,
    credentials: true,
  });

  cachedApp.setGlobalPrefix('api');

  await cachedApp.init();
  return expressApp;
}

export default async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const expressApp = await initializeApp();
  expressApp(req, res);
};
