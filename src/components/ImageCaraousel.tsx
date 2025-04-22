'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TourImageCarouselProps {
  images: string[]
}

export default function TourImageCarousel({ images }: TourImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
      <img
        src={images[current]}
        alt={`Tour image ${current + 1}`}
        className="max-w-full max-h-full object-contain transition-all duration-300 ease-in-out"
      />

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
      >
        <ChevronLeft className="w-6 h-6 text-purple-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
      >
        <ChevronRight className="w-6 h-6 text-purple-700" />
      </button>
    </div>
  )
}
