import { z } from "zod";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { eq, and, ne } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const app = new Hono()
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(3).max(20),
      })
    ),
    async (c) => {
      const { name, email, password } = c.req.valid("json");
      const hashedPassword = await bcrypt.hash(password, 12);

      const query = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (query[0]) {
        return c.json({ error: "Email already in use" }, 400);
      }

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
      });

      return c.json(null, 200);
    },
  )
  .get(
    "/current",
    verifyAuth(),
    async (c) => {
      const auth = c.get("authUser");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          username: users.username,
          image: users.image,
          emailVerified: users.emailVerified,
        })
        .from(users)
        .where(eq(users.id, auth.token.id));

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ data: user });
    },
  )
  .patch(
    "/profile",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).optional(),
        username: z.string().min(3).max(20).optional(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check if username is being updated and if it's already taken
      if (values.username) {
        const existingUser = await db
          .select()
          .from(users)
          .where(
            and(
              eq(users.username, values.username),
              ne(users.id, auth.token.id)
            )
          );

        if (existingUser.length > 0) {
          return c.json({ error: "Username already taken" }, 400);
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set(values)
        .where(eq(users.id, auth.token.id))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          username: users.username,
          image: users.image,
        });

      if (!updatedUser) {
        return c.json({ error: "Failed to update profile" }, 400);
      }

      return c.json({ data: updatedUser });
    },
  );

export default app;