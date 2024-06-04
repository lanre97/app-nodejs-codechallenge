export interface TransactionModel {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transferenceTypeId: number;
  createdAt: Date;
}
