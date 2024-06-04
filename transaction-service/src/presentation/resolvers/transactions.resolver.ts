import { Logger } from '@nestjs/common';
import { CreateTransactionDto } from 'src/infraestructure/dtos/create-transaction.dto';
import { CreateTransactionAdapter } from 'src/infraestructure/adapters/create-transaction.adapter';
import { FindTransactionAdapter } from 'src/infraestructure/adapters/find-transaction.adapter';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindTransactionPresenter } from '../presenters/find-transaction.presenter';
import CreateTransactionPresenter from '../presenters/create-transaction.presenter';

@Resolver(() => FindTransactionPresenter)
export class TransactionsResolver {
  private readonly logger: Logger;
  constructor(
    private readonly createTransactionAdapter: CreateTransactionAdapter,
    private readonly findTransactionAdapter: FindTransactionAdapter,
  ) {
    this.logger = new Logger(TransactionsResolver.name);
  }

  @Mutation(() => CreateTransactionPresenter)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionDto,
  ) {
    const transactionCreated = await this.createTransactionAdapter.execute(
      createTransactionInput,
    );
    this.logger.log(
      `Transaction ${transactionCreated.transactionExternalId} created`,
    );
    return transactionCreated;
  }

  @Query(() => FindTransactionPresenter)
  async findTransactionById(
    @Args('transactionExternalId', { type: () => String })
    transactionExternalId: string,
  ) {
    return this.findTransactionAdapter.execute(transactionExternalId);
  }
}
