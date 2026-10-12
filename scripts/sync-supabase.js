const { execSync } = require('child_process')
require('dotenv').config()

async function main() {
  console.log('⚡ Starting Kagzify to Supabase Database Sync...')
  const dbUrl = process.env.DATABASE_URL || ''

  if (!dbUrl.startsWith('postgres')) {
    console.error('❌ DATABASE_URL in .env is not a PostgreSQL URL.')
    console.log('👉 Please set DATABASE_URL in your .env file to your Supabase PostgreSQL connection string:')
    console.log('   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"')
    process.exit(1)
  }

  console.log('📦 Pushing Prisma schema to Supabase...')
  try {
    execSync('npx prisma db push --schema=prisma/schema.postgresql.prisma', { stdio: 'inherit' })
    console.log('✅ Supabase Schema successfully synchronized!')
    
    console.log('🌱 Seeding initial products & admin account to Supabase...')
    execSync('node prisma/seed.js', { stdio: 'inherit' })
    console.log('🎉 Supabase database is 100% ready and merged with Kagzify Studio!')
  } catch (e) {
    console.error('❌ Sync error:', e.message)
    process.exit(1)
  }
}

main()
