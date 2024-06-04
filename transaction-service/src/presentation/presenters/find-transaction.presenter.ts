import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransferenceTypePresenter {
  @Field(() => String)
  name: string;
}
@ObjectType()
export class TransactionStatusPresenter {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class FindTransactionPresenter {
  @Field(() => String)
  transactionExternalId: string;
  @Field(() => String)
  accountExternalIdDebit: string;
  @Field(() => String)
  accountExternalIdCredit: string;
  @Field(() => TransferenceTypePresenter)
  transferenceType: TransferenceTypePresenter;
  @Field(() => TransactionStatusPresenter)
  transactionStatus: TransactionStatusPresenter;
  @Field(() => Number)
  value: number;
  @Field(() => Date)
  createdAt: Date;
}
