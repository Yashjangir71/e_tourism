'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import TourCard from '@/components/TourCard'

export default function AppHome() {
  const { data: session } = useSession()
  const [preferredTours, setPreferredTours] = useState([])

  useEffect(() => {
    const fetchTours = async () => {
      if (!session?.user?._id) return

      try {
        // get preferred tours
        if (session.user.userType == "tourist"){
          const preferRes = await axios.post('/api/get-booked-tours', {
            touristId: session.user._id
          })
  
          if (preferRes.data.success) {
            setPreferredTours(preferRes.data.tours)
          }
        }
      } catch (err) {
        console.error('Error loading tours:', err)
      }
    }

    fetchTours()
  }, [session])

  return (
    <div className="max-w-10/12 m-auto">
      {
        session?.user.userType == "tourist" &&
        <section className='m-auto'>
        <h2 className="text-2xl font-bold mb-4">Booked Tours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {preferredTours.map((tour: any) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      </section>
      }
    </div>
  )
}
