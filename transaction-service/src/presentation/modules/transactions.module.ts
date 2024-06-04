import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsResolver } from '../resolvers/transactions.resolver';
import { TransactionsConsumer } from '../consumers/transactions.consumer';
import { ApproveTransactionAdapter } from 'src/infraestructure/adapters/approve-transaction.adapter';
import { RejectTransactionAdapter } from 'src/infraestructure/adapters/reject-transaction.adapter';
import { FindTransactionAdapter } from 'src/infraestructure/adapters/find-transaction.adapter';
import { CreateTransactionAdapter } from 'src/infraestructure/adapters/create-transaction.adapter';
import { TransactionPrismaRepository } from 'src/infraestructure/repositories/transaction-prisma.repository';
import { KAFKA_SERVICE, UseCases } from 'src/infraestructure/utils/constants';
import { ApproveTransactionUseCase } from 'src/application/use-cases/approve-transaction.usecase';
import { RejectTransactionUseCase } from 'src/application/use-cases/reject-transaction.usecase';
import { FindTransactionUseCase } from 'src/application/use-cases/find-transaction.usecase';
import { KafkaEventPublisherService } from 'src/infraestructure/services/kafka-event-publisher.service';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.usecase';
import { PrismaService } from 'src/infraestructure/database/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ClientsModule.register([
      {
        name: KAFKA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
            clientId: 'transaction-service-client',
          },
          consumer: {
            groupId: 'transaction-consumer-group',
          },
        },
      },
    ]),
  ],
  providers: [
    PrismaService,
    ApproveTransactionAdapter,
    RejectTransactionAdapter,
    FindTransactionAdapter,
    CreateTransactionAdapter,
    TransactionPrismaRepository,
    KafkaEventPublisherService,
    {
      provide: UseCases.approveTransaction,
      inject: [TransactionPrismaRepository],
      useFactory: (transactionRepository: TransactionPrismaRepository) =>
        new ApproveTransactionUseCase(transactionRepository),
    },
    {
      provide: UseCases.rejectTransaction,
      inject: [TransactionPrismaRepository],
      useFactory: (transactionRepository: TransactionPrismaRepository) =>
        new RejectTransactionUseCase(transactionRepository),
    },
    {
      provide: UseCases.findTransaction,
      inject: [TransactionPrismaRepository],
      useFactory: (transactionRepository: TransactionPrismaRepository) =>
        new FindTransactionUseCase(transactionRepository),
    },
    {
      provide: UseCases.createTransaction,
      inject: [TransactionPrismaRepository, KafkaEventPublisherService],
      useFactory: (
        transactionRepository: TransactionPrismaRepository,
        kafkaEventPublisherService: KafkaEventPublisherService,
      ) =>
        new CreateTransactionUseCase(
          transactionRepository,
          kafkaEventPublisherService,
        ),
    },
    TransactionsResolver,
  ],
  controllers: [TransactionsConsumer],
})
export class TransactionsModule {}
