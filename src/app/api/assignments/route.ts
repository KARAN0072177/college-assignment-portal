import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1️⃣ Session check
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    if (session.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2️⃣ Read multipart form data
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string | null;
    const file = formData.get("file") as File;

    if (!title || !subject || !file) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF or DOCX files are allowed" },
        { status: 400 }
      );
    }

    // 4️⃣ Prepare S3 upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const s3Key = `assignments/${session.userId}/${Date.now()}-${file.name}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3.send(uploadCommand);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // 5️⃣ Save assignment in DB
    await Assignment.create({
      title,
      subject,
      description: description || "",
      fileName: file.name,
      fileUrl,
      s3Key,
      fileType: file.type,
      fileSize: file.size,
      studentId: session.userId,
    });

    return NextResponse.json(
      { message: "Assignment submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Assignment upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Session check
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    if (session.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch student's assignments
    const assignments = await Assignment.find({
      studentId: session.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Fetch assignments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}