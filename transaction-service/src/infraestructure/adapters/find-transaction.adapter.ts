import { Inject, Injectable } from '@nestjs/common';
import { UseCases } from '../utils/constants';
import { FindTransactionUseCase } from 'src/application/use-cases/find-transaction.usecase';
import { FindTransactionPresenter } from 'src/presentation/presenters/find-transaction.presenter';
import { TransactionWithTransferenceTypeModel } from 'src/domain/models/transaction.model';

@Injectable()
export class FindTransactionAdapter {
  constructor(
    @Inject(UseCases.findTransaction)
    private readonly findTransactionUseCase: FindTransactionUseCase,
  ) {}
  async execute(transactionId: string): Promise<FindTransactionPresenter> {
    const transaction =
      await this.findTransactionUseCase.execute(transactionId);
    return this.mapModelToPresenter(transaction);
  }

  mapModelToPresenter(
    transaction: TransactionWithTransferenceTypeModel,
  ): FindTransactionPresenter {
    return {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      value: transaction.value,
      transactionStatus: {
        name: transaction.transactionStatus,
      },
      transferenceType: {
        name: transaction.transferenceType.name,
      },
      createdAt: transaction.createdAt,
    };
  }
}
