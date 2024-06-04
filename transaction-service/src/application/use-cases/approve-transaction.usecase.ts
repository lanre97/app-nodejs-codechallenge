import { TransactionStatusModel } from 'src/domain/models/transaction-status.model';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

export class ApproveTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transactionId: string) {
    return this.transactionRepository.updateTransaction(
      transactionId,
      TransactionStatusModel.approved,
    );
  }
}
