function getRandomSkills(skillIds: number[], count: number): number[] {
  const shuffled = [...skillIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

type UserSkillSeed = {
  userId: number;
  skillId: number;
  description: string;
};

export const UserSkillSeed: UserSkillSeed[] = [];

const skillIds = [1, 2, 3, 4, 5, 6, 7, 8]; // TypeScript, C, Docker, Go, JavaScript, NestJS, PostgreSQL, React

for (let userId = 1; userId <= 20; userId++) {
  const count = Math.floor(Math.random() * 2) + 2;
  const pickedSkills = getRandomSkills(skillIds, count);
  pickedSkills.forEach(skillId => {
    UserSkillSeed.push({
      userId,
      skillId,
      description: ``,
    });
  });
}
