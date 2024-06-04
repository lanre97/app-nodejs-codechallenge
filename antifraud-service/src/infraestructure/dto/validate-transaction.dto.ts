import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsUUID } from 'class-validator';

export class ValidateTransactionDto {
  @IsUUID()
  transactionExternalId: string;
  @IsUUID()
  accountExternalIdDebit: string;
  @IsUUID()
  accountExternalIdCredit: string;
  @IsNumber()
  @Type(() => Number)
  transferenceTypeId: number;
  @IsNumber()
  @Type(() => Number)
  value: number;
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
