import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin1234', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@clean.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@clean.local',
      passwordHash,
      role: 'ADMIN',
      color: '#F97316',
    },
  })

  console.log('Seeded user:', admin.email, '/ password: admin1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
