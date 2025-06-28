import { PrismaClient, Role, JobType, JobStatus } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categories = [
  'Plumbing', 'Electrical', 'Cleaning', 'Moving', 'Painting',
  'Gardening', 'IT Support', 'Handyman', 'Carpentry', 'Pest Control'
];

async function main() {
  // 1. Seed JobCategory table
  const categoryRecords = [];
  for (const name of categories) {
    const cat = await prisma.jobCategory.create({
      data: { name }
    });
    categoryRecords.push(cat);
  }

  // 2. Create 30 providers
  const providers = [];
  const hashedPassword = await bcrypt.hash('password', 10);
  for (let i = 0; i < 30; i++) {
    const provider = await prisma.user.create({
      data: {
        email: `provider${i}@mail.com`,
        name: faker.person.fullName(),
        password: hashedPassword, 
        role: Role.PROVIDER,
        rating: Number((Math.random() * 5).toFixed(2)),
        jobHistory: faker.number.int({ min: 1, max: 50 }),
        isAvailable: true,
      },
    });
    providers.push(provider);
  }

  // 3. Create 10 customers (for job ownership)
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

  // 4. Create 100 jobs
  for (let i = 0; i < 100; i++) {
    const category = categoryRecords[Math.floor(Math.random() * categoryRecords.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    await prisma.job.create({
      data: {
        title: faker.lorem.words({ min: 2, max: 5 }),
        description: faker.lorem.sentences({ min: 1, max: 3 }),
        category: { connect: { id: category.id } }, 
        type: Math.random() > 0.5 ? JobType.QUICK_BOOK : JobType.POST_AND_QUOTE,
        status: JobStatus.COMPLETED,
        price: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
        acceptPrice: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
        scheduledAt: faker.date.past(),
        createdAt: faker.date.past(),
         customer: { connect: { id: customer.id } },
       provider: { connect: { id: provider.id } },
      
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