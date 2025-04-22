import dbConnect from "@/lib/dbConnect";
import TouristModel, { Tourist } from "@/models/Tourist.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { touristUsername, preferArray } = await request.json();

    const tourist = await TouristModel.findOne({username: touristUsername})

    if (!tourist) {
        return Response.json({
            success: false,
            message: "Error while adding preferences"
        }, {status: 500})
    }

    preferArray.map((cat: string)=> (
        tourist.preferences.push(cat)
    ) )

    await tourist.save()

    return Response.json({
      success: true,
      message: "Preferences set successfully"
    }, {status: 200})
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
