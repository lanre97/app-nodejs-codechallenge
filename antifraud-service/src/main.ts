import { NestFactory } from '@nestjs/core';
import { AntifraudModule } from './presentation/modules/antifraud.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'antifraud-service-client',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'antifraud-consumer-group',
        },
      },
    },
  );
  await app.listen().then(() => {
    console.log('🚀 Antifraud service is running');
  });
}
bootstrap();
