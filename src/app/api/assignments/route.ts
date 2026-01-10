import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1️⃣ Read session cookie
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);

    // 2️⃣ Role check
    if (session.role !== "student") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 3️⃣ Read body
    const { title, subject } = await req.json();
    if (!title || !subject) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Save assignment
    await Assignment.create({
      title,
      subject,
      studentId: session.userId,
    });

    return NextResponse.json(
      { message: "Assignment submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Assignment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}