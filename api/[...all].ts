import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import express, { Application } from 'express';
import { AppModule } from '../src/app.module';

let cachedApp: INestApplication | null = null;

async function initializeApp(): Promise<Application> {
  if (cachedApp) {
    const adapter = cachedApp.getHttpAdapter();
    return adapter.getInstance() as Application;
  }

  const expressApp = express();
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
