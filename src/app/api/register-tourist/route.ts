import dbConnect from "@/lib/dbConnect";
import TouristModel from "@/models/Tourist.model";
import bcrypt from "bcryptjs";

import { sendTouristVerificationEmail } from "@/helpers/sendTouristVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, name, email, password } = await request.json();
    const existingUserVerifiedByUsername = await TouristModel.findOne({
      username,
      isEmailVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await TouristModel.findOne({ email });
    const verifyEmailCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isEmailVerified){
        return Response.json({
            success: false,
            message: "User already exists with this email"
        }, {status: 400})
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.username = username;
        existingUserByEmail.name = name;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyEmailCode = verifyEmailCode;
        existingUserByEmail.verifyEmailCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new TouristModel({
        username,
        name,
        email,
        password: hashedPassword,
        preferences: [],
        bookedTours: [],
        verifyEmailCode,
        verifyEmailCodeExpiry: expiryDate,
        isEmailVerified: false,
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendTouristVerificationEmail(email, name, verifyEmailCode)

    if (!emailResponse.success) {
        return Response.json({
            success: false,
            message: emailResponse.message
        }, {status: 500})
    }

    return Response.json({
        success: true,
        message: "User registered successfully. Please verify your email"
    }, {status: 201})
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
