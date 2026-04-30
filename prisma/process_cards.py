"""
Script untuk proses CSV data kartu Yu-Gi-Oh
dan generate JSON seed untuk database
"""

import pandas as pd
import json
import re
from collections import defaultdict

# Path ke file CSV
CSV_PATH = r'C:\Users\fajar\.cache\kagglehub\datasets\hammadus\yugioh-full-card-database-index-august-1st-2025\versions\13\yugioh-ccd-2025SEP12-163128.csv'
OUTPUT_PATH = r'D:\Website Kartu Yugioh\prisma\seed_data.json'

print("Loading CSV data...")
df = pd.read_csv(CSV_PATH, encoding='utf-8')
print(f"Total entries: {len(df)}")
print(f"Unique cards: {df['name'].nunique()}")

# Deduplicate: Ambil 1 entry terbaik per kartu
# Priority: Urutkan berdasarkan rarity, ambil yang pertama

# Rarity priority (higher = better)
rarity_priority = {
    'C': 1, 'Common': 1,
    'R': 2, 'Rare': 2,
    'SR': 3, 'Super Rare': 3,
    'UR': 4, 'Ultra Rare': 4,
    'GR': 5, 'Ghost Rare': 5,
    'SE': 6, 'Secret Rare': 6,
    'UtR': 7, 'Ultimate Rare': 7,
    'ScR': 8, 'Secret Rare': 8,
    'Star': 9, 'Starlight Rare': 9,
}

def get_rarity_score(rarity):
    if pd.isna(rarity):
        return 0
    rarity = str(rarity).strip()
    return rarity_priority.get(rarity, 1)

df['rarity_score'] = df['rarity'].apply(get_rarity_score)

# Sort by rarity score (descending) then by name
df_sorted = df.sort_values(['name', 'rarity_score'], ascending=[True, False])

# Drop duplicates, keep first (best rarity)
cards_df = df_sorted.drop_duplicates(subset=['name'], keep='first').copy()

print(f"Unique cards after deduplication: {len(cards_df)}")

# Process each card
def parse_level_rank(rank_str):
    """Parse level/rank from string like 'Level 5' or 'Rank 4' or 'Link 3 P123'"""
    if pd.isna(rank_str):
        return None, None, None

    rank_str = str(rank_str)

    # Link monster
    if 'Link' in rank_str:
        match = re.search(r'Link (\d+)', rank_str)
        if match:
            link_rating = int(match.group(1))
            # Link markers: Top, Top-Right, Right, Bottom-Right, Bottom, Bottom-Left, Left, Top-Left
            return None, None, link_rating

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

def parse_price(price_str):
    """Parse price string to float"""
    if pd.isna(price_str) or price_str == '-':
        return None
    try:
        # Remove $ and convert
        price = str(price_str).replace('$', '').replace(',', '')
        return float(price)
    except:
        return None

def clean_description(desc):
    """Clean description text"""
    if pd.isna(desc):
        return None
    # Remove extra quotes
    desc = str(desc).replace('""', '"')
    return desc

def safe_int(value):
    """Safely convert value to int or return None"""
    if pd.isna(value) or value == '-' or value == '':
        return None
    try:
        return int(float(str(value)))
    except:
        return None

def format_subtype(subtype):
    """Format sub_type for cleaner display"""
    if pd.isna(subtype):
        return None
    return str(subtype).strip()

def generate_slug(name):
    """Generate URL-friendly slug from name"""
    # Remove special characters except spaces
    slug = re.sub(r'[^\w\s-]', '', str(name))
    # Replace spaces with hyphens
    slug = re.sub(r'\s+', '-', slug)
    # Lowercase
    slug = slug.lower()
    return slug

# Build cards list
cards = []
for idx, row in cards_df.iterrows():
    level, rank, link_rating = parse_level_rank(row['rank'])

    card = {
        "name": str(row['name']).strip() if pd.notna(row['name']) else None,
        "type": str(row['type']).lower() if pd.notna(row['type']) else None,
        "subType": format_subtype(row['sub_type']),
        "attribute": str(row['attribute']).upper() if pd.notna(row['attribute']) else None,
        "level": level,
        "rank": rank,
        "linkRating": link_rating,
        "attack": safe_int(row['attack']),
        "defense": safe_int(row['defense']),
        "description": clean_description(row['description']),
        "passcode": str(row['index']) if pd.notna(row['index']) else None,
        "setName": str(row['set_name']) if pd.notna(row['set_name']) else None,
        "setCode": str(row['set_id']) if pd.notna(row['set_id']) else None,
        "rarity": str(row['rarity']) if pd.notna(row['rarity']) else None,
        "releaseDate": str(row['set_release']) if pd.notna(row['set_release']) else None,
        "price": parse_price(row['price']),
    }

    cards.append(card)

# Create categories from archetypes/subTypes
categories_data = defaultdict(lambda: {"name": None, "description": None, "count": 0})

# Group cards by monster type (base type without effects)
def get_base_type(subtype):
    if pd.isna(subtype):
        return None
    subtype = str(subtype)
    # Remove effect/normal/etc suffixes
    base = subtype.split('／')[0].strip('[]')
    return base

for card in cards:
    base_type = get_base_type(card.get('subType'))
    if base_type and base_type not in ['Spell', 'Trap', 'Continuous', 'Counter', 'Equip', 'Field', 'Quick-Play', 'Ritual']:
        if base_type not in categories_data:
            categories_data[base_type] = {
                "name": base_type,
                "description": f"Yu-Gi-Oh {base_type} monster cards",
                "count": 1
            }
        else:
            categories_data[base_type]["count"] += 1

# Create categories list (top 50 by count)
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

# Add monster types as categories (top 20)
sorted_types = sorted(categories_data.items(), key=lambda x: x[1]['count'], reverse=True)[:30]
for type_name, data in sorted_types:
    categories.append({
        "name": data['name'],
        "slug": generate_slug(data['name']),
        "description": f"All {data['name']} monster cards - {data['count']} cards total"
    })

# Create output
output = {
    "metadata": {
        "totalCards": len(cards),
        "totalCategories": len(categories),
        "generatedFrom": "yugioh-ccd-2025SEP12-163128.csv",
        "generatedAt": pd.Timestamp.now().isoformat()
    },
    "categories": categories,
    "cards": cards
}

# Save to JSON
print(f"Saving to {OUTPUT_PATH}...")
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Done! Generated {len(cards)} cards and {len(categories)} categories")

# Print summary
print("\n=== SUMMARY ===")
print(f"Total cards: {len(cards)}")
print(f"  - Monster: {len([c for c in cards if c['type'] == 'monster'])}")
print(f"  - Spell: {len([c for c in cards if c['type'] == 'spell'])}")
print(f"  - Trap: {len([c for c in cards if c['type'] == 'trap'])}")
print(f"Total categories: {len(categories)}")

# Sample cards
print("\n=== SAMPLE CARDS ===")
for card in cards[:5]:
    print(f"- {card['name']} ({card['type']}) - {card.get('attribute', 'N/A')}")
    if card['attack']:
        print(f"  ATK: {card['attack']} / DEF: {card['defense']}")
