'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

const tourSchema = z.object({
  tourName: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.enum(['adventure', 'culture', 'relaxation', 'wildlife', 'historical']),
  location: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  slotsLeft: z.number(),
  itinerary: z.array(z.object({
    place: z.string(),
    plan: z.string(),
    time: z.string()
  })),
  images: z.any()
})

type TourFormData = z.infer<typeof tourSchema>

export default function CreateTourForm() {
  const { data: session } = useSession()
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      itinerary: [{ place: '', plan: '', time: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary'
  })

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
    setValue('images', files)
  }

  const onSubmit = async (data: TourFormData) => {
    try {
      setUploading(true)

      const formData = new FormData()
      for (const file of data.images) {
        formData.append('images', file)
      }

      const imageRes = await axios.post('/api/upload-tour-images', formData)
      const imageUrls = imageRes.data.urls

      const tour = await axios.post('/api/create-tour', {
        ...data,
        imageUrls,
        vendorId: session?.user?._id
      })

      

      router.push(`/app/tour/${tour.data.tour._id}`)

      alert('Tour created!')
    } catch (err) {
      console.error(err)
      alert('Failed to create tour')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <Label>Tour Name</Label>
        <Input {...register('tourName')} />
        {errors.tourName && <p className="text-red-500">{errors.tourName.message}</p>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register('description')} />
      </div>

      <div>
        <Label>Price ($)</Label>
        <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
      </div>

      <div>
  <Label>Available Slots</Label>
  <Input type="number" {...register('slotsLeft', { valueAsNumber: true })} />
  {errors.slotsLeft && <p className="text-red-500">{errors.slotsLeft.message}</p>}
</div>


      <div>
        <Label>Category</Label>
        <select {...register('category')} className="border p-2 rounded w-full">
          <option value="">Select category</option>
          <option value="adventure">Adventure</option>
          <option value="culture">Culture</option>
          <option value="relaxation">Relaxation</option>
          <option value="wildlife">Wildlife</option>
          <option value="historical">Historical</option>
        </select>
      </div>

      <div>
        <Label>Location</Label>
        <Input {...register('location')} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Start Date</Label>
          <Input type="date" {...register('startDate')} />
        </div>
        <div className="flex-1">
          <Label>End Date</Label>
          <Input type="date" {...register('endDate')} />
        </div>
      </div>

      

      <div>
        <Label>Itinerary</Label>
        {fields.map((field, idx) => (
          <div key={field.id} className="border p-3 rounded mb-3 space-y-2">
            <Input placeholder="Place" {...register(`itinerary.${idx}.place`)} />
            <Textarea placeholder="Plan" {...register(`itinerary.${idx}.plan`)} />
            <Input placeholder="Time" {...register(`itinerary.${idx}.time`)} />
            <Button variant="destructive" type="button" onClick={() => remove(idx)}>Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ place: '', plan: '', time: '' })}>Add Day</Button>
      </div>

      <div>
        <Label>Upload Images</Label>
        <Input type="file" accept="image/*" multiple onChange={onImageChange} />
        <div className="flex flex-wrap gap-4 mt-2">
          {imagePreviews.map((src, idx) => (
            <img key={idx} src={src} alt={`preview-${idx}`} className="h-24 rounded shadow" />
          ))}
        </div>
      </div>

      <Button type="submit" disabled={uploading}>
        {uploading ? 'Creating...' : 'Create Tour'}
      </Button>
    </form>
  )
}
