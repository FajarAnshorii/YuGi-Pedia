const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.card.count();
  console.log('TOTAL CARDS IN CARDS TABLE RIGHT NOW:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
