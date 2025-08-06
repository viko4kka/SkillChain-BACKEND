function getRandomSkills(skillIds: number[], count: number): number[] {
  const shuffled = [...skillIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

type UserSkillSeed = {
  userId: number;
  skillId: number;
  description: string;
};

const skillDescriptions: Record<number, string> = {
  1: 'Developed web applications using TypeScript, including a task management project.',
  2: 'Coded algorithms and simple console games in C during university coursework.',
  3: 'Set up development environments and CI pipelines using Docker for multiple teams.',
  4: 'Built microservices and REST APIs in Go for open source projects.',
  5: 'Used JavaScript daily to create interactive websites and single-page applications.',
  6: 'Implemented REST APIs with NestJS, including authentication and database integration.',
  7: 'Designed schemas and wrote complex SQL queries in PostgreSQL for company applications.',
  8: 'Created reusable components and managed application state in React for a dashboard project.',
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
      description: skillDescriptions[skillId] ?? '',
    });
  });
}
