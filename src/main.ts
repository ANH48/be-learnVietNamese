import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); 

  const config = new DocumentBuilder()
    .setTitle('LVN API')
    .setDescription('The Learn Vienamese API')
    .setVersion('1.0')
    .addTag('lvn')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(4000);
}
bootstrap();

