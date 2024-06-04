import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntifraudController } from '../controllers/antifraud.controller';
import { KafkaEventPublisherService } from 'src/infraestructure/services/kafka-event-publisher.service';
import { ValidateTransactionAdapter } from 'src/infraestructure/adapters/validate-transaction.adapter';
import { KAFKA_SERVICE, UseCases } from 'src/infraestructure/utils/constants';
import { ValidateTransactionUseCase } from 'src/application/use-cases/validate-transaction.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: KAFKA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
            clientId: 'antifraud-service-client',
          },
          consumer: {
            groupId: 'antifraud-consumer-group',
          },
        },
      },
    ]),
  ],
  providers: [
    KafkaEventPublisherService,
    ValidateTransactionAdapter,
    {
      provide: UseCases.validateTransaction,
      inject: [KafkaEventPublisherService],
      useFactory: (kafkaEventPublisherService: KafkaEventPublisherService) =>
        new ValidateTransactionUseCase(kafkaEventPublisherService),
    },
  ],
  controllers: [AntifraudController],
})
export class AntifraudModule {}
