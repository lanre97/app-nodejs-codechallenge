import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ValidateTransactionDto } from 'src/infraestructure/dto/validate-transaction.dto';
import { ValidateTransactionAdapter } from 'src/infraestructure/adapters/validate-transaction.adapter';
import { ValidateTransactionUseCase } from 'src/application/use-cases/validate-transaction.usecase';
import { EventPublisherService } from 'src/domain/services/event-publisher.service';
import { UseCases } from 'src/infraestructure/utils/constants';

describe('ValidateTransactionAdapter', () => {
  let adapter: ValidateTransactionAdapter;
  let useCase: ValidateTransactionUseCase;
  const mockEventPublisherService: EventPublisherService = {
    publish: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateTransactionAdapter,
        {
          provide: UseCases.validateTransaction,
          useFactory: (eventPublisherService: EventPublisherService) => {
            const mockUseCase = new ValidateTransactionUseCase(
              eventPublisherService,
            );
            mockUseCase.execute = jest.fn();
            return mockUseCase;
          },
          inject: ['EventPublisherService'],
        },
        {
          provide: 'EventPublisherService',
          useValue: mockEventPublisherService,
        },
      ],
    }).compile();

    adapter = module.get<ValidateTransactionAdapter>(
      ValidateTransactionAdapter,
    );
    useCase = module.get<ValidateTransactionUseCase>(
      UseCases.validateTransaction,
    );
  });

  it('should throw BadRequestException if DTO validation fails', async () => {
    // DTO con datos inválidos
    const invalidDto = new ValidateTransactionDto();
    invalidDto.transactionExternalId = '123';
    invalidDto.accountExternalIdDebit = 'abc';
    invalidDto.accountExternalIdCredit = 'def';
    invalidDto.transferenceTypeId = -1;
    invalidDto.value = -100;
    invalidDto.createdAt = new Date('not a date');

    await expect(adapter.execute(invalidDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should successfully validate and call execute method for valid DTO', async () => {
    // Crear un DTO con datos válidos
    const validDto = new ValidateTransactionDto();
    validDto.transactionExternalId = '123e4567-e89b-12d3-a456-426614174000';
    validDto.accountExternalIdDebit = '123e4567-e89b-12d3-a456-426614174000';
    validDto.accountExternalIdCredit = '123e4567-e89b-12d3-a456-426614174000';
    validDto.transferenceTypeId = 1;
    validDto.value = 1000;
    validDto.createdAt = new Date();

    // Ejecutar el adaptador con el DTO válido
    await adapter.execute(validDto);
    expect(useCase.execute).toHaveBeenCalled();
  });
});
