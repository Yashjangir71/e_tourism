import dbConnect from "@/lib/dbConnect";
import TourModel from "@/models/Tour.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { vendorId, tourName, description, price, category, location, imageUrls, itinerary, startDate, endDate, slotsLeft } = await request.json();

    const newTour = new TourModel({
        vendorId,
        title: tourName,
        description,
        price,
        category,
        location,
        imageUrls,
        itinerary,
        startDate,
        endDate,
        slotsLeft,
        rating: []
    })

    await newTour.save();

    return Response.json({
        success: true,
        message: "Tour created successfully",
        tour: newTour
    }, {status: 201})
  } catch (error) {
    console.error("Error creating tour:", error);
    return Response.json(
      {
        success: false,
        message: "Error creating tour",
      },
      {
        status: 500,
      }
    );
  }
}
