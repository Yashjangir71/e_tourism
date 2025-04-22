import { sendTourBookingEmail } from "@/helpers/sendTourBookingEmail";
import dbConnect from "@/lib/dbConnect";
import TourModel from "@/models/Tour.model";
import TouristModel from "@/models/Tourist.model";
import { debug } from "console";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { touristId, tourId, slots } = await request.json();

    const updateTour = await TourModel.findOne({_id: tourId})

    if (updateTour){
      if (updateTour.slotsLeft == 0 || (updateTour.slotsLeft - slots < 0)) {
        return Response.json({
          success: false,
          message: "Not enough slots available"
        }, {status: 400})
      }
      updateTour.slotsLeft -= slots
      await updateTour.save()
    }

    const tourist = await TouristModel.findOne({_id: touristId})

    if (!tourist) {
        return Response.json({
            success: false,
            message: "Tourist not found"
        }, {status: 500})
    }

    tourist.bookedTours.push(tourId)

    await tourist.save();

    // const tour = await TourModel.findOne({_id: tourId})
    const tourDetails = await TourModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(tourId) }
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
            vendorName: "$vendor.name",
            vendorPhone: "$vendor.phone"
          }
        }
    ]);

    const thisTour = tourDetails[0]

    debug(thisTour)
      

    const emailResponse = await sendTourBookingEmail(
        tourist.email,
        tourist.name,
        thisTour.title,
        thisTour.vendorName,
        thisTour.vendorPhone,
        thisTour.description,
        thisTour.itinerary,)
    
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

    return Response.json({
        success: true,
        message: "Tour booked successfully",
    }, {status: 201})
  } catch (error) {
    console.error("Error booking tour:", error);
    return Response.json(
      {
        success: false,
        message: "Error booking tour",
      },
      {
        status: 500,
      }
    );
  }
}
