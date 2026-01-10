import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    await connectDB();

    // 1️⃣ Read session
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);

    // 2️⃣ Role check (teacher only)
    if (session.role !== "teacher") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 3️⃣ Fetch assignments
    const assignments = await Assignment.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Teacher assignments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}