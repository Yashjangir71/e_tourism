import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TourModel from "@/models/Tour.model";
import mongoose from "mongoose";
import { debug } from "node:console";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { vendorId } = await req.json();

    debug(vendorId)

    const tours = await TourModel.aggregate([
      {
        $match: {
          vendorId: new mongoose.Types.ObjectId(vendorId)
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

    debug(tours)

    return NextResponse.json({ success: true, tours });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
