import { Inject, Injectable } from '@nestjs/common';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { UseCases } from '../utils/constants';
import { RejectTransactionUseCase } from 'src/application/use-cases/reject-transaction.usecase';

@Injectable()
export class RejectTransactionAdapter {
  constructor(
    @Inject(UseCases.rejectTransaction)
    private readonly rejectTransactionUseCase: RejectTransactionUseCase,
  ) {}
  async execute(transaction: UpdateTransactionDto) {
    return this.rejectTransactionUseCase.execute(
      transaction.transactionExternalId,
    );
  }
}
