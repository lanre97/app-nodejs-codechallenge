import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

export class FindTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transactionExternalId: string) {
    return this.transactionRepository.findById(transactionExternalId);
  }
}
