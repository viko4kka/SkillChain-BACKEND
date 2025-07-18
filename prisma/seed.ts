import { PrismaClient } from '@prisma/client';
import { users } from './seedingData/users';
import { skills } from './seedingData/skills';
import { languages } from './seedingData/languages';
import { locations } from './seedingData/locations';

const prisma = new PrismaClient();

async function main() {
  //USERS table
  await prisma.user.deleteMany(); // czysci tabele
  await prisma.user.createMany({
    data: users,
  });

  //SKILLS table
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: skills,
  });

  //LANGUAGES table
  await prisma.language.deleteMany();
  await prisma.language.createMany({
    data: languages,
  });

  //LOCATIONS table
  await prisma.location.deleteMany();
  await prisma.location.createMany({
    data: locations,
  });
}

main()
  .then(() => {
    console.log('Seeding finished.');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
