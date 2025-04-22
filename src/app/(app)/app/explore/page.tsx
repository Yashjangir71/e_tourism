'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TourCard from '@/components/TourCard'

export default function AppHome() {
  const { data: session } = useSession()
  const [allTours, setAllTours] = useState([])

  useEffect(() => {
    const fetchTours = async () => {
      if (!session?.user?._id) return

      try {
        // get
        

        // get all tours
        const allRes = await axios.get('/api/get-tours')
        if (allRes.data.success) {
          setAllTours(allRes.data.tours.slice(0, 4))
        }
      } catch (err) {
        console.error('Error loading tours:', err)
      }
    }

    fetchTours()
  }, [session])

  return (
    <div className="max-w-10/12 m-auto">
      {/* Explore Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {allTours.map((tour: any) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
        
      </section>
    </div>
  )
}
