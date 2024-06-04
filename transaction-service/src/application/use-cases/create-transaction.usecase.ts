import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEvents } from 'src/common/constants';
import {
  TransactionModel,
  TransactionWithoutIdModel,
} from 'src/domain/models/transaction.model';
import { EventPublisherService } from 'src/domain/services/event-publisher.service';
import { TransactionStatusModel } from 'src/domain/models/transaction-status.model';

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  async execute(
    transaction: TransactionWithoutIdModel,
  ): Promise<TransactionModel> {
    transaction.transactionStatus = TransactionStatusModel.pending;
    const newTransaction = await this.transactionRepository.create(transaction);
    await this.eventPublisherService.publish(
      TransactionEvents.transactionCreated,
      newTransaction,
    );
    return newTransaction;
  }
}
