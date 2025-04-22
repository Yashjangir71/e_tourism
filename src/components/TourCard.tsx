// components/TourCard.tsx

'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Tour = {
  _id: string
  title: string
  description: string
  category: string
  price: number
  imageUrls: string[]
  vendor: {
    name: string
    companyName?: string
  }
}

interface TourCardProps {
  tour: Tour
}

export default function TourCard({ tour }: TourCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/app/tour/${tour._id}`)
  }

  return (
    <Card
      onClick={handleClick}
      // className="flex flex-row p-5 cursor-pointer gap-3.5 bg-linear-to-bl from-violet-500 to-fuchsia-500 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      className="flex flex-row p-5 cursor-pointer bg-gradient-to-r from-fuchsia-300 to-violet-900 gap-3.5 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <img
        src={tour.imageUrls?.[0] || '/placeholder.jpg'}
        alt={tour.title}
        className="w-40 h-40 object-cover"
      />
      <CardContent className="flex flex-col justify-between p-4 w-full">
        <div>
          <h3 className="text-2xl font-bold">{tour.title}</h3>
          <p className="font-bold text-black">Price: ${tour.price}</p>
          <p className="font-bold text-black">Category: {tour.category}</p>
          <p className="text-sm mt-1 text-black">
            {tour.description.length > 100
              ? tour.description.slice(0, 100) + '...'
              : tour.description}
          </p>
        </div>
        <div className="mt-2 text-sm text-black">
          Hosted by: <span className="font-medium text-black">{tour.vendor.name}</span>
          {tour.vendor.companyName && ` · ${tour.vendor.companyName}`}
        </div>
      </CardContent>
    </Card>
  )
}
