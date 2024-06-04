import { TransactionModel } from 'src/domain/models/transaction.model';
import { Validator } from './validator.interface';
import { transactionConfig } from 'src/application/config/transactions';

export class MaxTransferValidator implements Validator<TransactionModel> {
  validate(input: TransactionModel): boolean {
    return input.value <= transactionConfig.max_value_allowed;
  }
}
