import bcrypt from 'bcrypt';
import { prisma } from '../db';

const DEFAULT_ADMIN_NAME = 'System Administrator';
type RoleName = 'ADMIN' | 'EDITOR';
const DEFAULT_ADMIN_ROLE: RoleName = 'ADMIN';

export async function seedAdminUser(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const name = process.env.SEED_ADMIN_NAME?.trim() || DEFAULT_ADMIN_NAME;
  const normalizedRole = process.env.SEED_ADMIN_ROLE?.trim().toUpperCase();
  const role: RoleName = normalizedRole === 'EDITOR' ? 'EDITOR' : DEFAULT_ADMIN_ROLE;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    console.log(`ℹ️  Admin seed skipped - user already exists for ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  console.log(`✅ Admin user created for ${email}`);
}
