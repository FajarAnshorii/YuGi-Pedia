// Types for Yu-Gi-Oh! Album (Schema V3)

export interface CardType {
  id: number
  name: string
}

export interface CardAttribute {
  id: number
  name: string
}

export interface CardFrame {
  id: number
  name: string
}

export interface MonsterRace {
  id: number
  name: string
}

export interface Rarity {
  id: number
  name: string
  code: string
}

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CardSet {
  id: number
  setName: string
  setCode: string
  rarityId: number
  rarity?: Rarity
  releaseDate: Date | null
  price: number | null
  cardId: string
  cardSetPrices?: CardSetPrice[]
}

export interface CardSetPrice {
  id: number
  source: string
  currency: string
  price: number | null
  priceHigh: number | null
  priceLow: number | null
  url: string | null
  lastUpdated: Date
  cardSetId: number
}

export interface CardCategory {
  cardId: string
  categoryId: number
  category?: Category
}

export interface Card {
  id: string
  name: string
  passcode: string | null
  typeId: number
  type?: CardType
  attributeId: number | null
  attribute?: CardAttribute | null
  frameId: number | null
  frame?: CardFrame | null
  raceId: number | null
  race?: MonsterRace | null
  level: number | null
  rank: number | null
  linkRating: number | null
  attack: number | null
  defense: number | null
  description: string | null
  imageUrl: string | null
  linkMarkers: string | null
  price: number | null
  // Market Prices
  cardMarketPrice: number | null
  tcgPlayerPrice: number | null
  eBayPrice: number | null
  amazonPrice: number | null
  coolStuffIncPrice: number | null
  priceUpdatedAt: Date | null
  subType: string | null
  createdAt: Date
  updatedAt: Date
  cardSets?: CardSet[]
  cardCategories?: CardCategory[]
}

// API Response types
export interface CardsResponse {
  cards: Card[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CategoriesResponse {
  categories: Category[]
}

// Form types
export interface CardFormData {
  name: string
  passcode?: string
  typeId: number
  attributeId?: number
  frameId?: number
  raceId?: number
  level?: number
  rank?: number
  linkRating?: number
  attack?: number
  defense?: number
  description?: string
  imageUrl?: string
  subType?: string
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
}
