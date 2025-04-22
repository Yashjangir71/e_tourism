import dbConnect from "@/lib/dbConnect";
import TourModel from "@/models/Tour.model";
import { debug } from "console";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { tourId } = await request.json();

    debug(tourId)

    const tourDetails = await TourModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(tourId)  }
        },
        {
          $lookup: {
            from: "vendors",
            localField: "vendorId",
            foreignField: "_id",
            as: "vendor"
          }
        },
        {
          $unwind: "$vendor"
        },
        {
          $project: {
            _id: 0,
            title: 1,
            description: 1,
            itinerary: 1,
            imageUrls:1,
            price:1,
            startDate:1,
            endDate:1,
            category: 1,
            slotsLeft: 1,
            vendorName: "$vendor.name",
            vendorPhone: "$vendor.phone",
            vendorDescription: "$vendor.description",
            vendorCompany: "$vendor.companyName",
            vendorWebsite: "$vendor.website"
          }
        }
    ]);

    const thisTour = tourDetails[0]

    debug(thisTour)
      

    return Response.json({
        success: true,
        thisTour,
        message: "Tour fetched successfully",
    }, {status: 201})
  } catch (error) {
    console.error("Error fetching tour:", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching tour",
      },
      {
        status: 500,
      }
    );
  }
}
