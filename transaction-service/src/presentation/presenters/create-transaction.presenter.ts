import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class CreateTransactionPresenter {
  @Field(() => String)
  transactionExternalId: string;
  @Field(() => String)
  accountExternalIdDebit: string;
  @Field(() => String)
  accountExternalIdCredit: string;
  @Field(() => Number)
  value: number;
  @Field(() => Number)
  transferenceTypeId: number;
  @Field(() => String)
  transactionStatus: string;
  @Field(() => Date)
  createdAt: Date;
}
