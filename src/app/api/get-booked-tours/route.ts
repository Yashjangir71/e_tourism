import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TourModel from "@/models/Tour.model";
import TouristModel from "@/models/Tourist.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { touristId } = await req.json();

    const user = await TouristModel.findOne({ _id: touristId });
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const bookedTours = user.bookedTours;
    // if (!bookedTours || bookedTours.length === 0) {
    //   return NextResponse.json({ success: false, message: "No booked tours set" }, { status: 400 });
    // }

    const tours = await TourModel.aggregate([
      {
        $match: {
          _id: { $in: bookedTours }
        }
      },
      {
        $lookup: {
          from: "vendors", // should match the name of your Vendor collection
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: "$vendor"
      }
    ]);

    return NextResponse.json({ success: true, tours });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
