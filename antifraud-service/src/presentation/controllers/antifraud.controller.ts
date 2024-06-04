import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionEvents } from 'src/common/constants';
import { ValidateTransactionAdapter } from 'src/infraestructure/adapters/validate-transaction.adapter';
import { ValidateTransactionDto } from 'src/infraestructure/dto/validate-transaction.dto';

@Controller()
export class AntifraudController {
  private readonly logger: Logger;
  constructor(
    public readonly validateTransactionAdapter: ValidateTransactionAdapter,
  ) {
    this.logger = new Logger(AntifraudController.name);
  }
  @EventPattern(TransactionEvents.transactionCreated)
  async handleTransactionCreated(@Payload() data: ValidateTransactionDto) {
    try {
      await this.validateTransactionAdapter.execute(data);
      this.logger.log(`Transaction ${data.transactionExternalId} validated`);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.error(`Invalid transaction data: ${JSON.stringify(data)}`);
      }
      this.logger.error(
        `Error validating transaction ${data.transactionExternalId}: ${error}`,
      );
    }
  }
}
