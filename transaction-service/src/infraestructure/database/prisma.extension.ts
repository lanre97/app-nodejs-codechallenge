import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

export function getExtendedPrismaClient() {
  const client = () =>
    new PrismaClient().$extends(
      readReplicas({
        url: process.env.DATABASE_URL_REPLICA,
      }),
    );

  return class {
    constructor() {
      return client();
    }
  } as new () => ReturnType<typeof client>;
}
