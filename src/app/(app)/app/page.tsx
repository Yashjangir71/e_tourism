'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TourCard from '@/components/TourCard'

export default function AppHome() {
  const { data: session } = useSession()
  const [preferredTours, setPreferredTours] = useState([])
  const [allTours, setAllTours] = useState([])

  useEffect(() => {
    const fetchTours = async () => {
      if (!session?.user?._id) return

      try {
        // get preferred tours
        if (session.user.userType == "tourist"){
          const preferRes = await axios.post('/api/get-prefered-tours', {
            touristId: session.user._id
          })
  
          if (preferRes.data.success) {
            setPreferredTours(preferRes.data.tours.slice(0, 4))
          }
        }
        

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
      {/* Preferred Section */}

      {
        session?.user.userType == "tourist" &&
        <section className='m-auto'>
        <h2 className="text-2xl font-bold mb-4">For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {preferredTours.map((tour: any) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
        {preferredTours.length > 0 && (
          <div className="text-center mt-6">
            <Link href="/app/prefered-tours">
              <Button variant="outline">Show All</Button>
            </Link>
          </div>
        )}
      </section>
      }
      

      {/* Explore Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {allTours.map((tour: any) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
        {allTours.length > 0 && (
          <div className="text-center mt-6">
            <Link href="/app/explore">
              <Button variant="outline">Show All</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
