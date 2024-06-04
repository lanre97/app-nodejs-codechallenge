import { Inject, Injectable } from '@nestjs/common';
import { UseCases } from '../utils/constants';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.usecase';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import {
  TransactionModel,
  TransactionWithoutIdModel,
} from 'src/domain/models/transaction.model';
import CreateTransactionPresenter from 'src/presentation/presenters/create-transaction.presenter';

@Injectable()
export class CreateTransactionAdapter {
  constructor(
    @Inject(UseCases.createTransaction)
    private readonly createTrasactionUseCase: CreateTransactionUseCase,
  ) {}

  async execute(
    transaction: CreateTransactionDto,
  ): Promise<CreateTransactionPresenter> {
    const newTransaction = await this.createTrasactionUseCase.execute(
      this.mapDtoToModel(transaction),
    );
    return this.mapModelToPresenter(newTransaction);
  }

  mapDtoToModel(transaction: CreateTransactionDto): TransactionWithoutIdModel {
    return {
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      value: transaction.value,
      transferenceTypeId: transaction.transferenceTypeId,
      transactionStatus: undefined,
      createdAt: undefined,
    };
  }

  mapModelToPresenter(
    transaction: TransactionModel,
  ): CreateTransactionPresenter {
    return {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      value: transaction.value,
      transactionStatus: transaction.transactionStatus,
      transferenceTypeId: transaction.transferenceTypeId,
      createdAt: transaction.createdAt,
    };
  }
}
