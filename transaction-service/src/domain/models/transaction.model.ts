import { TransactionStatusModel } from './transaction-status.model';
import { TransferenceTypeModel } from './transference-type.model';

export interface TransactionWithoutIdModel {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transferenceTypeId: number;
  transactionStatus: TransactionStatusModel;
  createdAt: Date;
}

export interface TransactionModel extends TransactionWithoutIdModel {
  transactionExternalId: string;
}

export interface TransactionWithTransferenceTypeModel extends TransactionModel {
  transferenceType: TransferenceTypeModel;
}
