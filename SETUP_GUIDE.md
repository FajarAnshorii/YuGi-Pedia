# 🎴 Yu-Gi-Oh! Album - Setup Guide

## 📋 Todo List (Setup Flow)

```
[TODO 1] ☐ Install dependencies (npm install)
[TODO 2] ☐ Setup PostgreSQL database (Neon.tech)
[TODO 3] ☐ Configure .env.local environment variables
[TODO 4] ☐ Generate Prisma client
[TODO 5] ☐ Push schema to database
[TODO 6] ☐ Seed database with card data
[TODO 7] ☐ Verify database data
[TODO 8] ☐ Create admin user account
```

---

## Step 1️⃣: Install Dependencies

```bash
# Buka terminal/Command Prompt di folder proyek
cd "D:/Website Kartu Yugioh"

# Install semua dependencies
npm install
```

**Expected output:**
```
added 250 packages in 30s
```

---

## Step 2️⃣: Setup PostgreSQL Database

### Option A: Neon.tech (GRATIS - Recommended) ⚡

1. **Buka browser** → https://neon.tech

2. **Sign Up** → Gunakan email Anda

3. **Create New Project:**
   - Project name: `yugioh-album`
   - Region: Singapore (terdekat)
   - Branch: main

4. **Copy Connection String:**
   - Buka dashboard → Connection Details
   - Copy "Connection string" yang mirip:
   ```
   postgresql://username:password@ep-xxx-xxx-123456.sgp.neon.tech/yugioh-album
   ```

### Option B: Local PostgreSQL

```bash
# Jika sudah punya PostgreSQL terinstall
# Buat database baru
createdb yugioh_album

# Connection string:
postgresql://postgres:password@localhost:5432/yugioh_album
```

---

## Step 3️⃣: Configure Environment Variables

```bash
# Buat file .env.local di folder proyek
# copy dari .env.example
```

**Edit file `.env.local`:**

```env
# Database URL (dari Step 2)
DATABASE_URL="postgresql://username:password@ep-xxx-xxx-123456.sgp.neon.tech/yugioh-album"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="yugioh-album-secret-key-2026"

# Optional: untuk development
NODE_ENV="development"
```

---

## Step 4️⃣: Generate Prisma Client

```bash
npx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client for Node.js in 2.5s
```

---

## Step 5️⃣: Push Schema to Database

```bash
npx prisma db push
```

**Expected output:**
```
Your database is now in sync with your Prisma schema.

✔ Created schema _prisma_migrations
✔ Created tables:
  - users
  - categories
  - card_type
  - card_attribute
  - card_frame
  - monster_race
  - rarity
  - cards
  - card_sets
  - card_set_price
  - card_categories
  - user_cards
```

---

## Step 6️⃣: Seed Database with Card Data

```bash
# Tambah script ke package.json dulu (kalau belum ada)
```

**Edit `package.json`, tambahin:**
```json
"prisma": {
  "seed": "tsx prisma/seed_v3.ts"
}
```

**Run seed:**
```bash
npx prisma db seed
```

**Expected output:**
```
🌱 Starting seed process (v3)...
📊 Total cards: 13396
📁 Total categories: 29

🗑️ Clearing existing data...
✅ CardTypes: 3
✅ CardAttributes: 7
✅ CardFrames: 8
✅ MonsterRaces: 26
✅ Rarities: 12
🏷️ Seeding categories...
✅ Categories: 29
🃏 Seeding cards...
  📦 Processed 500/13396 cards...
  📦 Processed 1000/13396 cards...
  ...
✅ Cards seeded: 13396
👤 Creating default admin user...

✅ SEED COMPLETED SUCCESSFULLY!
   Total Cards: 13396
   Total Categories: 29
   Total Card-Categories: 22120
```

---

## Step 7️⃣: Verify Database Data

```bash
npx prisma studio
```

**Akan terbuka browser** → http://localhost:5555

**Cek tables:**
- [ ] `users` - 1 record (admin)
- [ ] `cards` - 13,396 records
- [ ] `card_sets` - ~34,000 records
- [ ] `categories` - 29 records
- [ ] `card_categories` - 22,120 records
- [ ] `card_type` - 3 records
- [ ] `card_attribute` - 7 records
- [ ] `rarity` - 12 records

---

## Step 8️⃣: Create Admin User Account

**Sudah dibuat otomatis saat seed:**
- Email: `admin@yugioh.com`
- Password: `admin123`

**Untuk bikin user admin baru:**
```bash
# Buka Prisma Studio
npx prisma studio

# Navigate ke users table
# Klik "Add Record"
# Isi:
#   - email: admin2@yugioh.com
#   - password: (bcrypt hash dari password baru)
#   - name: Admin 2
#   - role: ADMIN
```

**Generate bcrypt hash:**
```javascript
// Buka browser console, paste:
bcrypt.hash('password baru', 10).then(hash => console.log(hash))
```

---

## ✅ Setup Complete!

```
┌─────────────────────────────────────────────────────────┐
│                  SETUP CHECKLIST                        │
├─────────────────────────────────────────────────────────┤
│ [TODO 1] ☐ Install dependencies (npm install)           │
│ [TODO 2] ☐ Setup PostgreSQL database                  │
│ [TODO 3] ☐ Configure .env.local                       │
│ [TODO 4] ☐ Generate Prisma client                     │
│ [TODO 5] ☐ Push schema to database                    │
│ [TODO 6] ☐ Seed database with card data               │
│ [TODO 7] ☐ Verify database data                       │
│ [TODO 8] ☐ Create admin user account                  │
└─────────────────────────────────────────────────────────┘

                🎉 ALL DONE! 🎉

        Database is ready with:
        - 13,396 cards
        - 29 categories
        - 22,120 card-category relationships
        - Admin account ready
```

---

## 🔧 Troubleshooting

### Error: "Connection refused"
```
→ Pastikan PostgreSQL sudah jalan
→ Cek DATABASE_URL di .env.local
→ Pastikan tidak ada firewall blocking
```

### Error: "Unique constraint failed"
```
→ Run: npx prisma db push --force-reset
→ ⚠️ WARNING: Ini akan HAPUS semua data!
```

### Error: "Seed failed"
```
→ Pastikan semua dependencies sudah terinstall
→ Cek DATABASE_URL benar
→ Run: npx prisma validate
```

### Error: "Cannot find module './seed_data_v3.json'"
```
→ Seed data belum di-generate
→ Jalankan ulang process_cards_v2.py
```

---

## 📞 Need Help?

**Cek file:**
- `prisma/SCHEMA.md` - Full schema documentation
- `prisma/README_V3.md` - V3 documentation
- `README.md` - Project overview

**Common commands:**
```bash
npm run dev          # Start development server
npx prisma studio    # Open database GUI
npx prisma validate  # Validate schema
npx prisma format    # Format schema
```
