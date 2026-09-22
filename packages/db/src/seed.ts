import "dotenv/config";
import bcrypt from "bcryptjs";
import { env } from "@repo/env/admin";
import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  console.log("Seeding data");
  const passwordHash = await bcrypt.hash(env.PASSWORD, 12);

  await client.db.admin.upsert({
    where: { username: env.ADMIN_USERNAME },
    update: { passwordHash },
    create: {
      username: env.ADMIN_USERNAME,
      passwordHash,
    },
  });
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

  for (const post of posts) {
    await client.db.post.create({
      data: {
        id: post.id,
        urlId: post.urlId,
        title: post.title,
        description: post.description,
        content: post.content,
        imageUrl: post.imageUrl,
        category: post.category,
        tags: post.tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
        date: post.date,
        views: post.views,
        likes: post.likes,
        active: post.active,
      },
    });

    for (let index = 0; index < post.likes; index += 1) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${index}`,
        },
      });
    }
  }

  await client.db.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Post"', 'id'), COALESCE(MAX(id), 1), true) FROM "Post"`,
  );
}

seed()
  .then(() => client.db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await client.db.$disconnect();
    throw error;
  });
