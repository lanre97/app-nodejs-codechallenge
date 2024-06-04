import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsUUID()
  accountExternalIdDebit: string;
  @Field()
  @IsUUID()
  accountExternalIdCredit: string;
  @Field()
  @IsNumber()
  @Type(() => Number)
  transferenceTypeId: number;
  @Field()
  @IsNumber()
  @Type(() => Number)
  value: number;
}
