const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const columns = await prisma.$queryRaw`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_name = 'menus' 
    ORDER BY ordinal_position;
  `;
  console.log("Columns in 'menus':");
  console.table(columns);
}

main().finally(() => prisma.$disconnect());

