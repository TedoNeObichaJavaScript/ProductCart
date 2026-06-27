import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const org = await db.organization.upsert({
    where: { slug: "demo-venue" },
    update: {},
    create: {
      name: "Demo Bistro",
      slug: "demo-venue",
      venueType: "restaurant",
    },
  });

  const categoryNames = ["Meat", "Dairy", "Vegetables", "Café"];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const category = await db.category.upsert({
      where: { orgId_name: { orgId: org.id, name } },
      update: {},
      create: { orgId: org.id, name },
    });
    categories[name] = category.id;
  }

  const products = [
    {
      name: "Chicken breast",
      cat: "Meat",
      price: 8.9,
      total: 25,
      used: 6.5,
      wasted: 0.5,
      reorder: 5,
    },
    {
      name: "Mozzarella",
      cat: "Dairy",
      price: 12.5,
      total: 20,
      used: 10,
      wasted: 1,
      reorder: 6,
    },
    {
      name: "Tomatoes",
      cat: "Vegetables",
      price: 3.2,
      total: 15,
      used: 12,
      wasted: 0.9,
      reorder: 4,
    },
    {
      name: "Espresso beans",
      cat: "Café",
      price: 24.0,
      total: 30,
      used: 5,
      wasted: 0,
      reorder: 8,
    },
  ];

  for (const p of products) {
    await db.product.create({
      data: {
        orgId: org.id,
        categoryId: categories[p.cat],
        name: p.name,
        pricePerUnit: p.price,
        unit: "KG",
        totalStock: p.total,
        usedStock: p.used,
        wastedStock: p.wasted,
        reorderLevel: p.reorder,
      },
    });
  }

  console.info(`Seeded org "${org.name}" with ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
