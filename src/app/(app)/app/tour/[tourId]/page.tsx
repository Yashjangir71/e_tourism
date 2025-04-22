"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import TourImageCarousel from "@/components/ImageCaraousel";
import { useSession } from "next-auth/react";

export default function TourPage() {
  const { tourId } = useParams();
  const [tour, setTour] = useState<any>(null);
  const [slots, setSlots] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const {data: session} = useSession()

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;
      const res = await axios.post("/api/get-tour", { tourId });
      if (res.data.success) setTour(res.data.thisTour);
    };

    fetchTour();
  }, [tourId]);

  const handleBooking = async () => {
    try {
      const res = await axios.post("/api/book-tour", {
        touristId: session?.user._id,
        tourId,
        slots,
      });
      alert("Tour booked successfully!");
    } catch (err:any) {
      const message = err.response?.data?.message || "Something went wrong";
      alert(`Booking failed. ${message}`);
    }
  };

  if (!tour) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Carousel */}
      <TourImageCarousel images={tour.imageUrls} />

      <div className="flex justify-between">
        <div>
      {/* Title, Category, Price */}
      <div className="mt-6">
        <h1 className="text-4xl font-bold text-gray-800">{tour.title}</h1>

        <p className="inline-block mt-2 bg-violet-100 text-violet-700 text-sm font-medium px-3 py-1 rounded-full">
          {tour.category}
        </p>

        <p className="text-xl font-semibold text-violet-600 mt-2">
          Price: ${tour.price}
        </p>
      </div>

      {/* Vendor Info with Hover Card */}
      <div className="mt-4">
        <span
          className="text-md font-medium text-gray-600 cursor-pointer relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Host: {tour.vendorName}

          {isHovered && (
            <div className="absolute z-10 bg-white p-4 border shadow-xl w-64 rounded-lg top-full left-0 mt-2">
              <h3 className="font-bold text-lg mb-1">{tour.vendorName}</h3>
              <p className="text-sm text-gray-700 mb-1">{tour.vendorDescription}</p>
              <p className="text-sm text-gray-500">📞 {tour.vendorPhone}</p>
            </div>
          )}
        </span>

        {/* Optional Website and Company */}
        {tour.vendorWebsite && (
          <p className="text-sm text-gray-600 mt-1">🌐 {tour.vendorWebsite}</p>
        )}
        {tour.vendorCompany && (
          <p className="text-sm text-gray-600">🏢 {tour.vendorCompany}</p>
        )}
      </div>
      </div>
      <div className="pt-3.5 pr-3">
      {/* Slots Left */}
      <div className="mt-4 text-md text-green-700 font-semibold">
        Slots Left: {tour.slotsLeft}
      </div>

        {session?.user.userType == "tourist" && 
        <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Book Now</Button>
          </DialogTrigger>
          <DialogContent>
          <DialogTitle>Book this Tour</DialogTitle>
            <h2 className="text-lg font-bold mb-2">Confirm Booking</h2>
            <label>Number of Slots:</label>
            <Input
              type="number"
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              min={1}
              max={tour.slotsLeft}
              className="mb-2"
            />
            <p>Total Price: ${slots * tour.price}</p>
            <Button onClick={handleBooking} className="mt-2">
              Confirm Booking
            </Button>
          </DialogContent>
        </Dialog>
      </div>
        }
      {/* Booking Button with Dialog */}
      </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-1">About the Tour</h2>
        <p>Start Date: {new Date(tour.startDate).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})}</p>
        <p>End Date: {new Date(tour.endDate).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})}</p>
        <p className="text-gray-700 whitespace-pre-wrap">{tour.description}</p>
      </div>

      {/* Itinerary */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Itinerary</h2>
        <div className="space-y-4">
          {tour.itinerary.map((item: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{item.place}</h3>
                <p className="text-sm text-gray-500">{item.time}</p>
                <p className="text-gray-700 mt-1">{item.plan}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
