import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Local development accounts. Email and password come from .env (SEED_EMAIL, SEED_PASSWORD).
async function main() {
  const email = process.env.SEED_EMAIL ?? "test@email.com";
  const password = process.env.SEED_PASSWORD ?? "Test1";
  const passwordHash = await bcrypt.hash(password, 10);
  const [local, domain] = email.split("@");

  const pro = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Test Coach", role: "professional", locale: "en" },
  });
  // Second account for admin testing. Plus-address of the same mailbox, same password.
  await prisma.user.upsert({
    where: { email: `${local}+admin@${domain}` },
    update: { passwordHash },
    create: { email: `${local}+admin@${domain}`, passwordHash, name: "Test Admin", role: "admin", locale: "en" },
  });

  const demo = [
    { name: "Giulia Rossi", type: "coach", phase: "cut", sex: "female", heightCm: 168, goal: "Bikini prep, stage in 14 weeks", allergies: "None", notes: "Trains 5 days, upper lower split. Evening hunger rising.", weights: [64.8, 64.3, 63.9, 63.5, 63.1, 62.6, 62.3] },
    { name: "Marco Bianchi", type: "coach", phase: "offseason", sex: "male", heightCm: 181, goal: "Lean offseason, add 3 kg of quality mass", allergies: "None", notes: "Push pull legs, 6 days. Sleep 7.5 h.", weights: [88.1, 88.3, 88.9, 89.1, 89.3, 89.8, 90.0] },
    { name: "Sofia Conti", type: "nutrition", phase: "maintenance", sex: "female", heightCm: 165, goal: "More energy, better digestion, lose 4 kg slowly", allergies: "Lactose intolerance", notes: "Office job, bloating after dairy.", weights: [71.2, 71.1, 70.6, 70.4, 70.1, 69.9, 69.8] },
  ];

  await prisma.client.deleteMany({ where: { ownerId: pro.id } });
  for (const d of demo) {
    const { weights, ...data } = d;
    await prisma.client.create({
      data: {
        ...data,
        ownerId: pro.id,
        measures: {
          create: weights.map((w, i) => ({ weightKg: w, date: new Date(Date.now() - (weights.length - 1 - i) * 7 * 864e5) })),
        },
      },
    });
  }
  console.log(`Seeded ${email} and ${local}+admin@${domain} with ${demo.length} demo clients`);
}

main().finally(() => prisma.$disconnect());
