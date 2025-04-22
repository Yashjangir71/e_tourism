import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TourModel from "@/models/Tour.model";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const tours = await TourModel.aggregate([
      {
        $lookup: {
          from: "vendors", // make sure this matches your Vendor collection name
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
