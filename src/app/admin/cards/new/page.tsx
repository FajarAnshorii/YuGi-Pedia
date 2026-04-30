'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react'

export default function NewCardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'monster',
    subType: '',
    attribute: '',
    level: '',
    rank: '',
    linkRating: '',
    attack: '',
    defense: '',
    description: '',
    passcode: '',
    setName: '',
    setCode: '',
    rarity: '',
    releaseDate: '',
    price: '',
    imageUrl: '',
    categoryId: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          level: formData.level ? parseInt(formData.level) : null,
          rank: formData.rank ? parseInt(formData.rank) : null,
          linkRating: formData.linkRating ? parseInt(formData.linkRating) : null,
          attack: formData.attack ? parseInt(formData.attack) : null,
          defense: formData.defense ? parseInt(formData.defense) : null,
          price: formData.price ? parseFloat(formData.price) : null,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        }),
      })

      if (response.ok) {
        router.push('/admin/cards')
      } else {
        alert('Failed to create card')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating card')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/admin/cards" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft size={20} />
        Back to Cards
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">Add New Card</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              >
                <option value="monster">Monster</option>
                <option value="spell">Spell</option>
                <option value="trap">Trap</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Type / Monster Type</label>
              <input
                type="text"
                name="subType"
                value={formData.subType}
                onChange={handleChange}
                placeholder="e.g., [Dragon／Effect]"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attribute</label>
              <select
                name="attribute"
                value={formData.attribute}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Attribute</option>
                <option value="FIRE">FIRE</option>
                <option value="WATER">WATER</option>
                <option value="EARTH">EARTH</option>
                <option value="WIND">WIND</option>
                <option value="LIGHT">LIGHT</option>
                <option value="DARK">DARK</option>
                <option value="DIVINE">DIVINE</option>
              </select>
            </div>
          </div>

          {/* Monster Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
              <input
                type="number"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                min="0"
                max="13"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Rating</label>
              <input
                type="number"
                name="linkRating"
                value={formData.linkRating}
                onChange={handleChange}
                min="1"
                max="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passcode</label>
              <input
                type="text"
                name="passcode"
                value={formData.passcode}
                onChange={handleChange}
                placeholder="8-digit code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* ATK/DEF */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ATK</label>
              <input
                type="number"
                name="attack"
                value={formData.attack}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DEF</label>
              <input
                type="number"
                name="defense"
                value={formData.defense}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Card Effect</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Set Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Name</label>
              <input
                type="text"
                name="setName"
                value={formData.setName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Code</label>
              <input
                type="text"
                name="setCode"
                value={formData.setCode}
                onChange={handleChange}
                placeholder="e.g., LED4-EN034"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
              <select
                name="rarity"
                value={formData.rarity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Rarity</option>
                <option value="C">Common</option>
                <option value="R">Rare</option>
                <option value="SR">Super Rare</option>
                <option value="UR">Ultra Rare</option>
                <option value="GR">Ghost Rare</option>
                <option value="SE">Secret Rare</option>
              </select>
            </div>
          </div>

          {/* Image & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Card'}
            </button>
            <Link
              href="/admin/cards"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}