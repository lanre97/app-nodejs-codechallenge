import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionsModule } from './presentation/modules/transactions.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const microserviceApp = await NestFactory.createMicroservice(
    TransactionsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'transaction-consumer-group',
        },
      },
    },
  );

  await microserviceApp.listen();

  console.log('🚀 Transaction broker is running');

  const app = await NestFactory.create(TransactionsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Transaction service is running on: ${await app.getUrl()}`);
}
bootstrap();
