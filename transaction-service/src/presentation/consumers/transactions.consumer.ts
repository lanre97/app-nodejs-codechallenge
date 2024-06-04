import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionEvents } from 'src/common/constants';
import { ApproveTransactionAdapter } from 'src/infraestructure/adapters/approve-transaction.adapter';
import { RejectTransactionAdapter } from 'src/infraestructure/adapters/reject-transaction.adapter';
import { UpdateTransactionDto } from 'src/infraestructure/dtos/update-transaction.dto';

@Controller()
export class TransactionsConsumer {
  private readonly logger: Logger;
  constructor(
    private readonly approveTransactionAdapter: ApproveTransactionAdapter,
    private readonly rejectTransactionAdapter: RejectTransactionAdapter,
  ) {
    this.logger = new Logger(TransactionsConsumer.name);
  }

  @EventPattern(TransactionEvents.transactionApproved)
  async handleTransactionApproved(
    @Payload() transaction: UpdateTransactionDto,
  ) {
    await this.approveTransactionAdapter.execute(transaction);
    this.logger.log(
      `Transaction ${transaction.transactionExternalId} approved`,
    );
  }
  @EventPattern(TransactionEvents.transactionRejected)
  async handleTransactionRejected(
    @Payload() transaction: UpdateTransactionDto,
  ) {
    await this.rejectTransactionAdapter.execute(transaction);
    this.logger.log(
      `Transaction ${transaction.transactionExternalId} rejected`,
    );
  }
}
