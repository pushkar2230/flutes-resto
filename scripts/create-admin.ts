import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const username = "admin";
  const name = "Flutes Administrator";
  const password = "1818";

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: {
      username,
    },
    update: {
      name,
      password: hashedPassword,
    },
    create: {
      username,
      name,
      password: hashedPassword,
    },
  });

  console.log("Admin account created successfully.");
  console.log(`Username: ${username}`);
  console.log(`Name: ${name}`);
  console.log("Password has been securely hashed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });