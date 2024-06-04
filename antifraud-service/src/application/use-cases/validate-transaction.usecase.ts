import { TransactionEvents } from 'src/common/constants';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { EventPublisherService } from 'src/domain/services/event-publisher.service';
import { ValidationOrchestrator } from '../validation/validator-orchestrator';
import { MaxTransferValidator } from '../validation/validators/max-transfer.validator';

export class ValidateTransactionUseCase {
  private readonly validator: ValidationOrchestrator<TransactionModel>;
  constructor(private readonly eventPublisher: EventPublisherService) {
    this.validator = new ValidationOrchestrator([new MaxTransferValidator()]);
  }
  async execute(transaction: TransactionModel): Promise<void> {
    if (this.validator.validate(transaction)) {
      await this.eventPublisher.publish(
        TransactionEvents.transactionApproved,
        transaction,
      );
      return;
    }
    await this.eventPublisher.publish(
      TransactionEvents.transactionRejected,
      transaction,
    );
  }
}
