import { PrismaClient } from '@prisma/client';
import { users } from './seedingData/users';
import { skills } from './seedingData/skills';
import { languages } from './seedingData/languages';
import { locations } from './seedingData/locations';
import { userLanguages } from './seedingData/userLanguage';
import { userSkills } from './seedingData/userSkill';
import { projects } from './seedingData/projects';

const prisma = new PrismaClient();

async function main() {
  // Delete junction tables first (to avoid foreign key constraints)
  await prisma.userSkill.deleteMany();
  await prisma.userLanguage.deleteMany();

  // Delete main tables (users depend on locations, so delete users first)
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.language.deleteMany();
  await prisma.location.deleteMany();

  // Reset auto-increment sequences
  await prisma.$executeRaw`ALTER SEQUENCE "Location_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Skill_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Language_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;

  // Create reference tables first
  // LOCATIONS table (users depend on this)
  await prisma.location.createMany({
    data: locations,
  });

  // SKILLS table
  await prisma.skill.createMany({
    data: skills,
  });

  // LANGUAGES table
  await prisma.language.createMany({
    data: languages,
  });

  // USERS table (depends on locations)
  await prisma.user.createMany({
    data: users,
  });

  // Junction tables last
  // USER LANGUAGES table
  await prisma.userLanguage.createMany({
    data: userLanguages,
  });

  // USER SKILLS table
  await prisma.userSkill.createMany({
    data: userSkills,
  });

  //USER PROJECTS table
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: projects,
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
