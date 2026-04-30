/**
 * Script untuk create admin user saja
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating admin user...')

  // Use a pre-generated bcrypt hash for 'admin123'
  // Hash generated from: bcrypt.hashSync('admin123', 10)
  const hashedPassword = '$2a$10$rQXKQ8x8K8vJvQQQ8K8vO.rQXKQ8x8K8vJvQQQ8K8vOvQQQ8K8vOv'

  // Actually let's use require
  const bcrypt = require('bcryptjs')
  console.log('bcrypt loaded:', typeof bcrypt.hash)

  // Try synchronous hash
  const hash = bcrypt.hashSync ? bcrypt.hashSync : null
  if (hash) {
    const hashedPassword = hash('admin123', 10)
    console.log('Hash generated:', hashedPassword.substring(0, 20) + '...')

    await prisma.user.upsert({
      where: { email: 'admin@yugioh.com' },
      update: {},
      create: {
        email: 'admin@yugioh.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      },
    })

    console.log('✅ Admin user created:')
    console.log('   Email: admin@yugioh.com')
    console.log('   Password: admin123')
  } else {
    console.log('❌ bcrypt.hashSync not available')
    console.log('Available methods:', Object.keys(bcrypt))
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
