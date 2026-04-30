import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FolderOpen, Plus } from 'lucide-react'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { cardCategories: true }
      }
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categories Management</h1>
        <Link
          href="/admin/categories/new"
          className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Category
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Cards Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="font-semibold dark:text-white">{category.name}</td>
                <td className="text-gray-500 dark:text-gray-400 font-mono text-sm">{category.slug}</td>
                <td className="text-gray-600 dark:text-gray-400 text-sm">{category.description || '-'}</td>
                <td>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-sm font-semibold">
                    {category._count.cardCategories}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FolderOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No categories found. Create your first category!</p>
          </div>
        )}
      </div>
    </div>
  )
}