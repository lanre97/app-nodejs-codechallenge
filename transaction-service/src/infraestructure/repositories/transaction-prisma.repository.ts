import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { PrismaService } from '../database/prisma.service';
import { TransactionStatusModel } from 'src/domain/models/transaction-status.model';
import {
  TransactionModel,
  TransactionWithoutIdModel,
  TransactionWithTransferenceTypeModel,
} from 'src/domain/models/transaction.model';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionPrismaRepository implements TransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async updateTransaction(
    transactionId: string,
    transactionStatus: TransactionStatusModel,
  ): Promise<TransactionModel> {
    const updatedTransaction = await this.prismaService.transaction.update({
      where: {
        transactionExternalId: transactionId,
      },
      data: {
        transactionStatus: transactionStatus as TransactionStatus,
      },
      include: {
        transferenceType: true,
      },
    });
    return {
      transactionExternalId: updatedTransaction.transactionExternalId,
      accountExternalIdDebit: updatedTransaction.accountExternalIdDebit,
      accountExternalIdCredit: updatedTransaction.accountExternalIdCredit,
      value: updatedTransaction.value,
      transferenceTypeId: updatedTransaction.transferenceTypeId,
      transactionStatus:
        updatedTransaction.transactionStatus as TransactionStatusModel,
      createdAt: updatedTransaction.createdAt,
    };
  }
  async create(
    transaction: TransactionWithoutIdModel,
  ): Promise<TransactionModel> {
    const newTransaction = await this.prismaService.transaction.create({
      data: {
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        value: transaction.value,
        transferenceType: {
          connect: { id: transaction.transferenceTypeId },
        },
        transactionStatus: transaction.transactionStatus as TransactionStatus,
        createdAt: transaction.createdAt,
      },
    });
    return {
      transactionExternalId: newTransaction.transactionExternalId,
      accountExternalIdDebit: newTransaction.accountExternalIdDebit,
      accountExternalIdCredit: newTransaction.accountExternalIdCredit,
      value: newTransaction.value,
      transferenceTypeId: newTransaction.transferenceTypeId,
      transactionStatus:
        newTransaction.transactionStatus as TransactionStatusModel,
      createdAt: newTransaction.createdAt,
    };
  }

  async findById(
    transactionId: string,
  ): Promise<TransactionWithTransferenceTypeModel | null> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        transactionExternalId: transactionId,
      },
      include: {
        transferenceType: true,
      },
    });

    if (!transaction) {
      return null;
    }

    return {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      value: transaction.value,
      transferenceTypeId: transaction.transferenceTypeId,
      transactionStatus:
        transaction.transactionStatus as TransactionStatusModel,
      createdAt: transaction.createdAt,
      transferenceType: {
        name: transaction.transferenceType.name,
      },
    };
  }
}
