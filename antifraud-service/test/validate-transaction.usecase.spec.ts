import { Test, TestingModule } from '@nestjs/testing';
import { EventPublisherService } from 'src/domain/services/event-publisher.service';
import { ValidateTransactionUseCase } from 'src/application/use-cases/validate-transaction.usecase';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { UseCases } from 'src/infraestructure/utils/constants';
import { TransactionEvents } from 'src/common/constants';

describe('ValidateTransactionUseCase', () => {
  let useCase: ValidateTransactionUseCase;
  const mockEventPublisherService: EventPublisherService = {
    publish: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UseCases.validateTransaction,
          useFactory: (eventPublisherService: EventPublisherService) =>
            new ValidateTransactionUseCase(eventPublisherService),
          inject: ['EventPublisherService'],
        },
        {
          provide: 'EventPublisherService',
          useValue: mockEventPublisherService,
        },
      ],
    }).compile();

    useCase = module.get<ValidateTransactionUseCase>(
      UseCases.validateTransaction,
    );
  });

  it('should publish transactionApproved if validation passes', async () => {
    const transaction = {
      accountExternalIdDebit: '470d3318-e8ad-4668-bb5d-c18e9c48f521',
      accountExternalIdCredit: '7c032778-cdfc-4b4c-b354-67cd93c79468',
      transferenceTypeId: 1,
      value: 1000,
      transactionExternalId: 'e8c1b5b5-8f9b-4f6d-8d1c-7c5d5f9b1f2b',
      createdAt: new Date(),
    } as TransactionModel; // Valid transaction data
    await useCase.execute(transaction);
    expect(mockEventPublisherService.publish).toHaveBeenCalledWith(
      TransactionEvents.transactionApproved,
      transaction,
    );
  });

  it('should publish transactionRejected if validation fails', async () => {
    const transaction = {
      accountExternalIdDebit: '470d3318-e8ad-4668-bb5d-c18e9c48f521',
      accountExternalIdCredit: '7c032778-cdfc-4b4c-b354-67cd93c79468',
      transferenceTypeId: 1,
      value: 1001,
      transactionExternalId: 'e8c1b5b5-8f9b-4f6d-8d1c-7c5d5f9b1f2b',
      createdAt: new Date(),
    } as TransactionModel; // Invalid transaction data
    await useCase.execute(transaction);
    expect(mockEventPublisherService.publish).toHaveBeenCalledWith(
      TransactionEvents.transactionRejected,
      transaction,
    );
  });
});
