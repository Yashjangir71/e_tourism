// /app/api/upload-tour-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary'; // or wherever your helper is

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  try {
    const uploadedUrls = await Promise.all(
      files.map(file => uploadToCloudinary(file))
    );

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
