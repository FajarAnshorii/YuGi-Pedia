/**
 * ================================================================
 * DATABASE SCHEMA DOCUMENTATION
 * Yu-Gi-Oh! Album - Database Design
 * ================================================================
 * 
 * Generated: 30 April 2026
 * Database: PostgreSQL 16+
 * ORM: Prisma 5.x
 * 
 * ================================================================
 * ERD (Entity Relationship Diagram)
 * ================================================================
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                         USERS                                 │
 * ├─────────────────────────────────────────────────────────────┤
 * │ id          : UUID (PK)                                      │
 * │ email       : VARCHAR(255) UNIQUE                             │
 * │ password   : VARCHAR(255) [bcrypt hashed]                   │
 * │ name       : VARCHAR(100)                                    │
 * │ role       : ENUM(ADMIN, USER)                               │
 * │ createdAt  : TIMESTAMP                                       │
 * │ updatedAt  : TIMESTAMP                                       │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              │ 1:N (optional)
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                         CARDS                                │
 * ├─────────────────────────────────────────────────────────────┤
 * │ id          : UUID (PK)                                      │
 * │ name       : VARCHAR(255) NOT NULL                           │
 * │ type       : ENUM(MONSTER, SPELL, TRAP) NOT NULL            │
 * │ subType    : VARCHAR(100)  -- "[Dragon／Effect]"              │
 * │ attribute  : ENUM(FIRE, WATER, EARTH, WIND, LIGHT, DARK,     │
 * │              DIVINE)                                         │
 * │ passcode   : VARCHAR(20) UNIQUE -- 8-digit Konami ID         │
 * │ level      : INT      -- Level 1-12                          │
 * │ rank       : INT      -- Rank 0-13 (Xyz)                    │
 * │ linkRating : INT      -- Link 1-6 (Link monsters)           │
 * │ attack     : INT      -- ATK value                          │
 * │ defense    : INT      -- DEF value                          │
 * │ description: TEXT     -- Card effect text                  │
 * │ imageUrl   : TEXT     -- Image URL (YGOPRODeck)             │
 * │ price      : DECIMAL -- Latest TCG market price (USD)        │
 * │ createdAt  : TIMESTAMP                                       │
 * │ updatedAt  : TIMESTAMP                                       │
 * └─────────────────────────────────────────────────────────────┘
 *         │                                    │
 *         │ 1:N (cardSets)                    │ N:M (card_categories)
 *         ▼                                    ▼
 * ┌───────────────────────┐    ┌───────────────────────────────┐
 * │      CARD_SETS         │    │     CARD_CATEGORIES            │
 * ├───────────────────────┤    ├───────────────────────────────┤
 * │ id        : INT (PK)  │    │ cardId     : UUID (FK)         │
 * │ setName   : VARCHAR   │    │ categoryId : INT (FK)          │
 * │ setCode   : VARCHAR   │    └───────────────────────────────┘
 * │ rarity    : ENUM      │                   │
 * │ releaseDate: DATE     │                   │ N:1
 * │ price     : DECIMAL   │                   ▼
 * │ cardId    : UUID (FK) │    ┌───────────────────────────────┐
 * │ createdAt : TIMESTAMP │    │       CATEGORIES               │
 * │ updatedAt : TIMESTAMP │    ├───────────────────────────────┤
 * └───────────────────────┘    │ id          : INT (PK)       │
 *                               │ name        : VARCHAR UNIQUE│
 *                               │ slug        : VARCHAR UNIQUE│
 *                               │ description : TEXT          │
 *                               │ createdAt   : TIMESTAMP      │
 *                               │ updatedAt   : TIMESTAMP      │
 *                               └───────────────────────────────┘
 * 
 * ================================================================
 * ENUMS
 * ================================================================
 * 
 * CardType:
 *   - MONSTER  : Monster cards (normal, effect, fusion, etc.)
 *   - SPELL    : Spell cards (normal, quick-play, continuous, etc.)
 *   - TRAP    : Trap cards (normal, continuous, counter)
 * 
 * CardAttribute:
 *   - FIRE    : Fire attribute monsters
 *   - WATER   : Water attribute monsters
 *   - EARTH   : Earth attribute monsters
 *   - WIND    : Wind attribute monsters
 *   - LIGHT   : Light attribute monsters
 *   - DARK    : Dark attribute monsters
 *   - DIVINE  : Divine attribute (rare, only Egyptian God cards)
 * 
 * Rarity:
 *   - C       : Common
 *   - R       : Rare
 *   - SR      : Super Rare
 *   - UR      : Ultra Rare
 *   - GR      : Gold Rare / Ghost Rare
 *   - SECRET  : Secret Rare
 *   - ULTIMATE: Ultimate Rare
 *   - PRISMATIC: Prismatic Secret Rare
 *   - PLATINUM: Platinum Rare/Secret
 *   - STAR    : Starlight Rare
 *   - QUARTER : Quarter Century Secret Rare
 * 
 * UserRole:
 *   - ADMIN   : Full access (CRUD cards, categories, users)
 *   - USER    : Read-only access (view album)
 * 
 * ================================================================
 * RELATIONSHIPS
 * ================================================================
 * 
 * 1. Card → CardSet (1:N)
 *    - 1 kartu bisa muncul di banyak set berbeda
 *    - Contoh: "Blue-Eyes White Dragon" muncul di LED4, LC01, dll
 *    - ON DELETE CASCADE: jika kartu dihapus, semua set-nya ikut terhapus
 * 
 * 2. Card → Category (N:M via CardCategory)
 *    - 1 kartu bisa punya banyak kategori
 *    - 1 kategori punya banyak kartu
 *    - Contoh: kartu "Dark Magician" → categories: "Spellcaster", "Dark"
 *    - ON DELETE CASCADE pada kedua FK
 * 
 * 3. User → Card (1:N, optional future feature)
 *    - Jika nanti mau ada fitur "favorite" atau "collection"
 *    - Untuk saat ini belum diimplementasi
 * 
 * ================================================================
 * CARD SET STRUCTURE
 * ================================================================
 * 
 * CardSet menyimpan informasi set/booster pack tempat kartu muncul:
 * 
 * {
 *   "cardSets": [
 *     {
 *       "setName": "LEGENDARY DECK BUILDER'S PACK",
 *       "setCode": "YDLS-EN031",
 *       "rarity": "UR",
 *       "releaseDate": "2014-11-20",
 *       "price": 0.25
 *     },
 *     {
 *       "setName": "STRUCTURE DECK: BLUE-EYES WHITE DESTINY",
 *       "setCode": "LED4-EN034",
 *       "rarity": "UR",
 *       "releaseDate": "2025-02-14",
 *       "price": 0.99
 *     }
 *   ]
 * }
 * 
 * Notes:
 * - 1 kartu bisa muncul di 0-N set berbeda
 * - setCode unique per card (1 card per set combination)
 * - Data diurutkan berdasarkan releaseDate DESC (terbaru duluan)
 * 
 * ================================================================
 * CATEGORIES STRUCTURE
 * ================================================================
 * 
 * Categories yang di-generate dari data:
 * 
 * 1. Type-based categories:
 *    - "Monster Cards" (semua monster)
 *    - "Spell Cards" (semua spell)
 *    - "Trap Cards" (semua trap)
 * 
 * 2. Attribute-based categories:
 *    - FIRE monsters, WATER monsters, dll
 *    - (Bisa ditambahkan nanti jika diperlukan)
 * 
 * 3. Monster race-based categories (top 40):
 *    - "Dragon", "Fiend", "Warrior", "Spellcaster", dll
 *    - Berdasarkan subType field dalam CSV
 * 
 * ================================================================
 * INDEXES
 * ================================================================
 * 
 * Card table:
 *   - @@index([name])              -- Search by name
 *   - @@index([type])              -- Filter by type
 *   - @@index([attribute])         -- Filter by attribute
 *   - @@index([passcode])          -- Search by passcode
 * 
 * CardSet table:
 *   - @@unique([cardId, setCode])  -- Prevent duplicate card-set
 *   - @@index([setName])           -- Search by set name
 *   - @@index([cardId])            -- Join dengan card
 * 
 * ================================================================
 * DATA VOLUME ESTIMATION
 * ================================================================
 * 
 * Cards:        13,396 records
 * CardSets:     ~22,000 records (rata-rata 1.6 set per kartu)
 * Categories:   29 categories
 * CardCategory: ~40,000 junction records (estimasi)
 * 
 * Total storage estimation: ~50-100 MB (tanpa indexes)
 * 
 * ================================================================
 * API ENDPOINTS
 * ================================================================
 * 
 * Cards:
 *   GET    /api/cards              -- List cards (paginated, filterable)
 *   GET    /api/cards/:id         -- Get single card + sets
 *   POST   /api/cards             -- Create card (admin)
 *   PUT    /api/cards/:id         -- Update card (admin)
 *   DELETE /api/cards/:id         -- Delete card (admin)
 * 
 * Categories:
 *   GET    /api/categories        -- List all categories
 *   GET    /api/categories/:id    -- Get category + cards
 *   POST   /api/categories        -- Create category (admin)
 *   PUT    /api/categories/:id    -- Update category (admin)
 *   DELETE /api/categories/:id    -- Delete category (admin)
 * 
 * Auth:
 *   POST   /api/auth/[...nextauth]-- NextAuth handlers
 *   GET    /api/auth/providers    -- List auth providers
 * 
 * ================================================================
 * EXAMPLE QUERIES
 * ================================================================
 * 
 * 1. Get all monster cards with LIGHT attribute:
 *    ```sql
 *    SELECT * FROM cards
 *    WHERE type = 'MONSTER' AND attribute = 'LIGHT'
 *    ORDER BY name ASC
 *    LIMIT 20;
 *    ```
 * 
 * 2. Get Blue-Eyes White Dragon with all its sets:
 *    ```sql
 *    SELECT c.*, cs.setName, cs.rarity, cs.price
 *    FROM cards c
 *    LEFT JOIN card_sets cs ON c.id = cs.cardId
 *    WHERE c.name LIKE '%Blue-Eyes White Dragon%';
 *    ```
 * 
 * 3. Get all Dragon cards in 'Spellcaster' category:
 *    ```sql
 *    SELECT c.*
 *    FROM cards c
 *    JOIN card_categories cc ON c.id = cc.cardId
 *    JOIN categories cat ON cc.categoryId = cat.id
 *    WHERE cat.slug = 'dragon' AND cat.name = 'Spellcaster';
 *    ```
 * 
 * 4. Search cards by name:
 *    ```sql
 *    SELECT * FROM cards
 *    WHERE name ILIKE '%dark magician%';
 *    ```
 * 
 * ================================================================
 */
