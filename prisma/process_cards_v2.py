"""
Script untuk proses CSV data kartu Yu-Gi-Oh V2
dan generate JSON seed untuk database dengan struktur baru

Struktur:
- Card (1 record per kartu unik) + CardSet (set tempat kartu muncul)
"""

import pandas as pd
import json
import re
from collections import defaultdict

# Path ke file CSV
CSV_PATH = r'C:\Users\fajar\.cache\kagglehub\datasets\hammadus\yugioh-full-card-database-index-august-1st-2025\versions\13\yugioh-ccd-2025SEP12-163128.csv'
OUTPUT_PATH = r'D:\Website Kartu Yugioh\prisma\seed_data_v2.json'

print("Loading CSV data...")
df = pd.read_csv(CSV_PATH, encoding='utf-8')
print(f"Total entries: {len(df)}")

# Rarity normalization map (order matters - longer/more specific first)
RARITY_MAP = [
    # Platinum/Secret variants
    ('PSE Prismatic Secret Rare', 'PRISMATIC'),
    ('PS Platinum Secret Rare', 'PLATINUM'),
    ('PGR Premium Gold Rare', 'PLATINUM'),
    ('PL Platinum Rare', 'PLATINUM'),

    # Quarter Century
    ('QCSE Quarter Century Secret Rare', 'QUARTER'),

    # Secret variants
    ('10000 SE 10000 Secret Rare', 'SECRET'),
    ('SE Secret Rare', 'SECRET'),
    ('GSE Gold Secret', 'SECRET'),

    # Ghost/Gold
    ('GH Ghost Rare', 'GR'),
    ('GR Gold Rare', 'GR'),

    # Ultra/Special Ultra
    ("UR (PR) Ultra Rare (Pharaoh's Rare)", 'UR'),
    ('UR Ultra Rare', 'UR'),

    # Super Rare
    ('SR Super Rare', 'SR'),

    # Ultimate
    ('UL Ultimate Rare', 'ULTIMATE'),

    # Starlight
    ('STAR Starlight Rare', 'STAR'),

    # Starfoil/Shatterfoil
    ('ST Starfoil', 'C'),
    ('SH Shatterfoil', 'C'),

    # Mosaic Rare (map to Super Rare)
    ('MR Mosaic Rare', 'SR'),

    # Common/Rare
    ("CR COLLECTOR'S RARE", 'R'),
    ('R Rare', 'R'),
    ('C Common', 'C'),
]

def normalize_rarity(rarity):
    """Normalize rarity string to enum value"""
    if pd.isna(rarity):
        return 'C'
    rarity = str(rarity).strip()

    # Try exact match first (full string)
    for key, value in RARITY_MAP:
        if key == rarity:
            return value

    # Try partial match (key is substring of rarity)
    for key, value in RARITY_MAP:
        if key in rarity:
            return value

    # Default to Common
    return 'C'

def safe_int(value):
    """Safely convert value to int or return None"""
    if pd.isna(value) or value == '-' or value == '':
        return None
    try:
        return int(float(str(value)))
    except:
        return None

def safe_float(value):
    """Safely convert value to float or return None"""
    if pd.isna(value) or value == '-' or value == '':
        return None
    try:
        return float(str(value).replace('$', '').replace(',', ''))
    except:
        return None

def parse_level_rank(rank_str):
    """Parse level/rank from string like 'Level 5' or 'Rank 4' or 'Link 3 P123'"""
    if pd.isna(rank_str):
        return None, None, None

    rank_str = str(rank_str)

    # Link monster
    if 'Link' in rank_str:
        match = re.search(r'Link (\d+)', rank_str)
        if match:
            return None, None, int(match.group(1))

    # Rank (Xyz)
    if 'Rank' in rank_str:
        match = re.search(r'Rank (\d+)', rank_str)
        if match:
            return None, int(match.group(1)), None

    # Level
    if 'Level' in rank_str:
        match = re.search(r'Level (\d+)', rank_str)
        if match:
            return int(match.group(1)), None, None

    return None, None, None

def safe_date(date_str):
    """Convert date string to ISO format"""
    if pd.isna(date_str):
        return None
    try:
        date_str = str(date_str)
        if len(date_str) == 10 and '-' in date_str:
            return date_str  # Already in YYYY-MM-DD format
        return None
    except:
        return None

# =========================================
# Step 1: Group by card name
# For each unique card, collect ALL sets
# =========================================

print("Grouping cards by name...")
cards_dict = {}

for idx, row in df.iterrows():
    name = str(row['name']).strip() if pd.notna(row['name']) else None
    if not name:
        continue

    if name not in cards_dict:
        # Create new card entry
        level, rank, link_rating = parse_level_rank(row['rank'])

        cards_dict[name] = {
            "name": name,
            "type": str(row['type']).lower() if pd.notna(row['type']) else None,
            "subType": str(row['sub_type']).strip() if pd.notna(row['sub_type']) else None,
            "attribute": str(row['attribute']).upper() if pd.notna(row['attribute']) else None,
            "passcode": str(row['index']) if pd.notna(row['index']) else None,
            "level": level,
            "rank": rank,
            "linkRating": link_rating,
            "attack": safe_int(row['attack']),
            "defense": safe_int(row['defense']),
            "description": str(row['description']).replace('""', '"') if pd.notna(row['description']) else None,
            "price": safe_float(row['price']),
            "cardSets": []
        }

    # Add set info
    set_entry = {
        "setName": str(row['set_name']).strip() if pd.notna(row['set_name']) else None,
        "setCode": str(row['set_id']).strip() if pd.notna(row['set_id']) else None,
        "rarity": normalize_rarity(row['rarity']),
        "releaseDate": safe_date(row['set_release']),
        "price": safe_float(row['price']),
    }

    # Avoid duplicate sets
    existing_codes = [s['setCode'] for s in cards_dict[name]['cardSets']]
    if set_entry['setCode'] and set_entry['setCode'] not in existing_codes:
        cards_dict[name]['cardSets'].append(set_entry)

print(f"Total unique cards: {len(cards_dict)}")

# =========================================
# Step 2: Build categories from monster types
# =========================================

print("Building categories...")
categories = [
    {
        "name": "All Cards",
        "slug": "all-cards",
        "description": "All Yu-Gi-Oh cards in the database"
    },
    {
        "name": "Monster Cards",
        "slug": "monster-cards",
        "description": "All monster type cards"
    },
    {
        "name": "Spell Cards",
        "slug": "spell-cards",
        "description": "All spell type cards"
    },
    {
        "name": "Trap Cards",
        "slug": "trap-cards",
        "description": "All trap type cards"
    },
]

# Extract monster types from subType
type_counts = defaultdict(int)
for card in cards_dict.values():
    if card['type'] == 'monster' and card['subType']:
        # Get base type (before ／)
        base_type = card['subType'].split('／')[0].strip('[]')
        # Skip spell/trap types
        if base_type not in ['Continuous', 'Counter', 'Equip', 'Field', 'Quick-Play', 'Ritual', 'Normal']:
            type_counts[base_type] += 1

# Add monster types as categories
for base_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True)[:40]:
    slug = base_type.lower().replace(' ', '-').replace('_', '-')
    categories.append({
        "name": base_type,
        "slug": slug,
        "description": f"All {base_type} monster cards - {count} cards"
    })

# =========================================
# Step 3: Create output
# =========================================

cards = list(cards_dict.values())

# Sort cards alphabetically
cards.sort(key=lambda x: x['name'])

# Sort sets within each card by date (newest first)
for card in cards:
    card['cardSets'].sort(
        key=lambda x: x['releaseDate'] or '1900-01-01',
        reverse=True
    )

output = {
    "metadata": {
        "version": "2.0",
        "totalCards": len(cards),
        "totalCategories": len(categories),
        "generatedFrom": "yugioh-ccd-2025SEP12-163128.csv",
        "generatedAt": pd.Timestamp.now().isoformat()
    },
    "categories": categories,
    "cards": cards
}

# =========================================
# Step 4: Save to JSON
# =========================================

print(f"Saving to {OUTPUT_PATH}...")
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\n✅ Done! Generated:")
print(f"   - {len(cards)} cards")
print(f"   - {len(categories)} categories")
print(f"   - Each card has cardSets[] array")

# Statistics
print("\n📊 STATISTICS:")
monsters = len([c for c in cards if c['type'] == 'monster'])
spells = len([c for c in cards if c['type'] == 'spell'])
traps = len([c for c in cards if c['type'] == 'trap'])
print(f"   Monster: {monsters}")
print(f"   Spell: {spells}")
print(f"   Trap: {traps}")

# Cards with multiple sets
multi_set = len([c for c in cards if len(c['cardSets']) > 1])
print(f"   Cards in multiple sets: {multi_set}")

# Sample
print("\n📋 SAMPLE CARDS:")
for card in list(cards_dict.values())[:3]:
    print(f"   - {card['name']} ({card['type']})")
    print(f"     Sets: {len(card['cardSets'])}")
    if card['cardSets']:
        print(f"     Top set: {card['cardSets'][0]['setName']} ({card['cardSets'][0]['setCode']})")
