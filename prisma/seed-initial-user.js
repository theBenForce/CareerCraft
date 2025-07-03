const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting initial user seed...');

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Users already exist. Skipping initial user creation.');
    return;
  }

  const email = process.env.INITIAL_USER_EMAIL || 'admin@careercraft.local';
  let password = process.env.INITIAL_USER_PASSWORD;

  if (!password) {
    password = Math.random().toString(36).slice(-16);
    console.log('=========================================');
    console.log('  Creating User:');
    console.log(`  Username: ${email}`);
    console.log(`  Password: ${password}`);
    console.log('=========================================');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      id: '01JZ8GEZZ2C76281NSV3AG39ZB',
      email,
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
    },
  });

  console.log('Initial user created successfully!');
  console.log(`Email: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
