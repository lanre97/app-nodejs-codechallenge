import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCases } from '../utils/constants';
import { ValidateTransactionUseCase } from 'src/application/use-cases/validate-transaction.usecase';
import { ValidateTransactionDto } from '../dto/validate-transaction.dto';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { DtoValidator } from '../validators/dtos.validator';

@Injectable()
export class ValidateTransactionAdapter {
  private readonly dtoValidator: DtoValidator<ValidateTransactionDto>;
  constructor(
    @Inject(UseCases.validateTransaction)
    private readonly validateTransactionUseCase: ValidateTransactionUseCase,
  ) {
    this.dtoValidator = new DtoValidator(ValidateTransactionDto);
  }

  async execute(transaction: ValidateTransactionDto): Promise<void> {
    const isValid = await this.dtoValidator.validate(transaction);
    if (!isValid) {
      throw new BadRequestException('Invalid transaction data');
    }
    await this.validateTransactionUseCase.execute(
      this.mapValidateTransactionDtoToTransactionModel(transaction),
    );
  }

  mapValidateTransactionDtoToTransactionModel(
    transaction: ValidateTransactionDto,
  ): TransactionModel {
    return {
      transferenceTypeId: transaction.transferenceTypeId,
      value: transaction.value,
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      createdAt: transaction.createdAt,
    };
  }
}
