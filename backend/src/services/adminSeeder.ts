import bcrypt from 'bcrypt';
import { prisma } from '../db';

type RoleName = 'ADMIN' | 'EDITOR';

const DEFAULT_ADMIN_NAME = 'System Administrator';
const DEFAULT_ADMIN_ROLE: RoleName = 'ADMIN';
const TRUE_LIKE_VALUES = new Set(['true', '1', 'yes', 'y', 'on']);

type SeedAdminOptions = {
  silentOnSkip?: boolean;
};

function isTruthy(value?: string | null): boolean {
  if (!value) {
    return false;
  }
  return TRUE_LIKE_VALUES.has(value.trim().toLowerCase());
}

export async function seedAdminUser(
  options: SeedAdminOptions = {}
): Promise<void> {
  const { silentOnSkip = false } = options;

  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const name = process.env.SEED_ADMIN_NAME?.trim() || DEFAULT_ADMIN_NAME;
  const normalizedRole = process.env.SEED_ADMIN_ROLE?.trim().toUpperCase();
  const role: RoleName = normalizedRole === 'EDITOR' ? 'EDITOR' : DEFAULT_ADMIN_ROLE;
  const forceUpdate = isTruthy(process.env.SEED_ADMIN_FORCE);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    if (!forceUpdate) {
      if (!silentOnSkip) {
        console.log(`ℹ️  Admin seed skipped - user already exists for ${email}`);
        console.log('   Set SEED_ADMIN_FORCE=true to refresh the credentials.');
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    console.log(`🔁 Admin user refreshed for ${email}`);
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
