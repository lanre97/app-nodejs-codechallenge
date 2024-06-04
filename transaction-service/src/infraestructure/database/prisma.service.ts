import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { getExtendedPrismaClient } from './prisma.extension';

const ExtendedPrismaClient = getExtendedPrismaClient();

@Injectable()
export class PrismaService
  extends ExtendedPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
