'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import axios from 'axios'

const categories = ['adventure', 'culture', 'relaxation', 'wildlife', 'historical']

export default function SelectPreferencesPage() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const touristUsername = searchParams.get("touristUsername")

  const toggleCategory = (category: string) => {
    setSelected(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleProceed = async () => {
    if (selected.length < 2) {
      alert('Please select at least two categories.')
      return
    }

    try {
      await axios.post('/api/add-prefered-cat', {
        touristUsername,
        preferArray: selected
      })

      router.push('/login?type=tourist')
    } catch (err) {
      console.error(err)
      alert('Failed to save preferences')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Select Your Preferred Categories</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map(cat => (
          <Button
            key={cat}
            type="button"
            variant={selected.includes(cat) ? 'default' : 'outline'}
            onClick={() => toggleCategory(cat)}
            className={cn('capitalize')}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={handleProceed} disabled={selected.length < 2}>
          Proceed
        </Button>
      </div>
    </div>
  )
}
