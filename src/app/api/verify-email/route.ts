import dbConnect from "@/lib/dbConnect";
import TouristModel from "@/models/Tourist.model";
import VendorModel from "@/models/Vendor.model";
import { verifySchema } from "@/schemas/verifySchema";
import { debug } from "console";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { type, username, verifyCode } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    debug(type)
    debug(username)
    debug(verifyCode)
    debug(decodedUsername)
    let user 
    if (type == "tourist"){
      user = await TouristModel.findOne({ username: decodedUsername });
    } else if (type == "host"){
      user = await VendorModel.findOne({ username: decodedUsername });
    }

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 500 }
      );
    }

    debug(verifyCode)
    const resultCode = verifySchema.safeParse(verifyCode);
    debug(resultCode)

    if (!resultCode.success) {
      const verifyCodeError = resultCode.error.format()._errors || [];
      return Response.json(
        {
          success: false,
          message:
            verifyCodeError?.length > 0
              ? verifyCodeError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    // const { code } = resultCode.data;
    const code = resultCode.data

    const isCodeValid = user.verifyEmailCode === code;
    const isCodeNotExpired = new Date(user.verifyEmailCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isEmailVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
