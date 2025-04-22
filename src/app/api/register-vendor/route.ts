import dbConnect from "@/lib/dbConnect";
import VendorModel from "@/models/Vendor.model";
import bcrypt from "bcryptjs";

import { sendTouristVerificationEmail } from "@/helpers/sendTouristVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, name, email, phone, description, companyName, website, password } = await request.json();
    const existingUserVerifiedByUsername = await VendorModel.findOne({
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
    
    const existingUserVerifiedByPhone = await VendorModel.findOne({
      phone,
      isEmailVerified: true,
    });

    if (existingUserVerifiedByPhone) {
      return Response.json(
        {
          success: false,
          message: "This phone number is already in use",
        },
        { status: 400 }
      );
    }
    

    const existingUserByEmail = await VendorModel.findOne({ email });
    const verifyEmailCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isEmailVerified){
        return Response.json({
            success: false,
            message: "User already exists with this email"
        }, {status: 400})
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyEmailCode = verifyEmailCode;
        existingUserByEmail.verifyEmailCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new VendorModel({
        username,
        name,
        email,
        companyName,
        website,
        description,
        password: hashedPassword,
        phone,
        tours: [],
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
