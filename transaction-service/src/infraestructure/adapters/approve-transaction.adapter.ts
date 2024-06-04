import { Inject, Injectable } from '@nestjs/common';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { UseCases } from '../utils/constants';
import { ApproveTransactionUseCase } from 'src/application/use-cases/approve-transaction.usecase';

@Injectable()
export class ApproveTransactionAdapter {
  constructor(
    @Inject(UseCases.approveTransaction)
    private readonly approveTransactionUseCase: ApproveTransactionUseCase,
  ) {}
  async execute(transaction: UpdateTransactionDto) {
    return this.approveTransactionUseCase.execute(
      transaction.transactionExternalId,
    );
  }
}
