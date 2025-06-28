import { PrismaClient, Role, JobType, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const categories = [
  'Plumbing', 'Electrical', 'Cleaning', 'Moving', 'Painting',
  'Gardening', 'IT Support', 'Handyman', 'Carpentry', 'Pest Control'
];

async function main() {
  // 1. Create 30 providers
  const providers = [];
  for (let i = 0; i < 30; i++) {
    const provider = await prisma.user.create({
      data: {
        email: `provider${i}@mail.com`,
        name: faker.person.fullName(),
        password: 'password', 
        role: Role.PROVIDER,
        rating: Number((Math.random() * 5).toFixed(2)),
        jobHistory: faker.number.int({ min: 1, max: 50 }),
        isAvailable: true,
      },
    });
    providers.push(provider);
  }

  // 2. Create 10 customers (for job ownership)
  const customers = [];
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.user.create({
      data: {
        email: `customer${i}@mail.com`,
        name: faker.person.fullName(),
        password: 'hashedpassword',
        role: Role.CUSTOMER,
        isAvailable: true,
      },
    });
    customers.push(customer);
  }

  // 3. Create 100 jobs
  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    await prisma.job.create({
      data: {
        title: faker.lorem.words({ min: 2, max: 5 }),
        description: faker.lorem.sentences({ min: 1, max: 3 }),
        category,
        type: Math.random() > 0.5 ? JobType.QUICK_BOOK : JobType.POST_AND_QUOTE,
        status: JobStatus.COMPLETED,
        price: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
        acceptPrice: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
        scheduledAt: faker.date.past(),
        createdAt: faker.date.past(),
        customerId: customer.id,
        providerId: provider.id,
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seed complete!');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    return prisma.$disconnect();
  });