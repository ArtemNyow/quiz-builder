import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.quiz.findFirst({ where: { title: 'JavaScript basics' } });

  if (existing) {
    console.log('Sample quiz already present — nothing to seed.');
    return;
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: 'JavaScript basics',
      questions: {
        create: [
          {
            type: 'BOOLEAN',
            text: 'In JavaScript, `typeof null` returns "object".',
            position: 0,
            correctBoolean: true,
          },
          {
            type: 'INPUT',
            text: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
            position: 1,
            correctText: 'const',
          },
          {
            type: 'CHECKBOX',
            text: 'Which of these are primitive types in JavaScript?',
            position: 2,
            options: {
              create: [
                { text: 'string', isCorrect: true, position: 0 },
                { text: 'symbol', isCorrect: true, position: 1 },
                { text: 'array', isCorrect: false, position: 2 },
                { text: 'bigint', isCorrect: true, position: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded quiz "${quiz.title}" (${quiz.id}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
