import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format card type for display
export function formatCardType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

// Format attribute with color
export function getAttributeColor(attribute: string | null): string {
  const colors: Record<string, string> = {
    FIRE: 'text-red-500',
    WATER: 'text-blue-500',
    EARTH: 'text-yellow-600',
    WIND: 'text-green-400',
    LIGHT: 'text-yellow-300',
    DARK: 'text-purple-500',
    DIVINE: 'text-amber-300',
  }
  return colors[attribute || ''] || 'text-gray-400'
}

// Get attribute emoji
export function getAttributeEmoji(attribute: string | null): string {
  const emojis: Record<string, string> = {
    FIRE: '🔥',
    WATER: '💧',
    EARTH: '🌍',
    WIND: '💨',
    LIGHT: '☀️',
    DARK: '🌑',
    DIVINE: '⭐',
  }
  return emojis[attribute || ''] || ''
}

// Format rarity for display
export function formatRarity(rarity: string | null): string {
  if (!rarity) return ''
  return rarity.replace(/([A-Z]+)/g, ' $1').trim()
}

// Get rarity color
export function getRarityColor(rarity: string | null): string {
  const colors: Record<string, string> = {
    C: 'text-gray-400',
    Common: 'text-gray-400',
    R: 'text-blue-400',
    Rare: 'text-blue-400',
    SR: 'text-yellow-500',
    'Super Rare': 'text-yellow-500',
    UR: 'text-blue-500',
    'Ultra Rare': 'text-blue-500',
    GR: 'text-gray-300',
    'Ghost Rare': 'text-gray-300',
    SE: 'text-red-500',
    'Secret Rare': 'text-red-500',
  }
  return colors[rarity || ''] || 'text-gray-400'
}

// Get card type icon
export function getCardTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    monster: '👹',
    spell: '✨',
    trap: '🛡️',
  }
  return icons[type] || '🎴'
}