/**
 * Reset admin password:
 *   node scripts/resetAdminPassword.js your@email.com newPassword
 */
const { loadEnv } = require('../src/config/loadEnv');
loadEnv();

const { User } = require('../src/models');

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  const password = process.argv[3] || '12345678';

  if (!email) {
    console.error('Usage: node scripts/resetAdminPassword.js <email> [password]');
    process.exit(1);
  }

  const user = await User.findOne({ where: { email, role: 'admin' } });
  if (!user) {
    console.error(`No admin found with email: ${email}`);
    process.exit(1);
  }

  user.passwordHash = password;
  await user.save();
  console.log(`Password reset OK for admin: ${email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
