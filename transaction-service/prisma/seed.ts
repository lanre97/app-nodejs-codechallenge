import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  //Creación de tipos de transacciones para el ejemplo si es que no existen
  const transactionTypesCount = await prisma.transferenceType.count();
  if (transactionTypesCount > 0) {
    console.log('Transaction types already created');
    return;
  }
  const transactionTypes = ['Deposit', 'Withdrawal', 'Transfer'];
  for (const transactionType of transactionTypes) {
    await prisma.transferenceType.create({
      data: {
        name: transactionType,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
