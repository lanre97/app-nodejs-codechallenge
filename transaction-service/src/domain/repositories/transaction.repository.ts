import { TransactionStatusModel } from '../models/transaction-status.model';
import {
  TransactionModel,
  TransactionWithoutIdModel,
  TransactionWithTransferenceTypeModel,
} from '../models/transaction.model';

export interface TransactionRepository {
  create(transaction: TransactionWithoutIdModel): Promise<TransactionModel>;
  findById(
    transactionExternalId: string,
  ): Promise<TransactionWithTransferenceTypeModel | null>;
  updateTransaction(
    transactionId: string,
    transactionStatus: TransactionStatusModel,
  ): Promise<TransactionModel>;
}
