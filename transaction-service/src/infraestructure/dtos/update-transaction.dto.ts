import { IsNumber, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @IsUUID()
  transactionExternalId: string;
  @IsUUID()
  accountExternalIdDebit: string;
  @IsUUID()
  accountExternalIdCredit: string;
  @IsNumber()
  tranferTypeId: number;
  @IsNumber()
  value: number;
}
