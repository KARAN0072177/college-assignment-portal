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
      console.log("❌ No session cookie found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    console.log("🧠 Session data:", session);
    console.log("🆔 session.userId:", session.userId);
    console.log("🆔 session.id:", session.id);

    // 2️⃣ Role check (student only)
    if (session.role !== "student") {
      console.log("❌ Role mismatch:", session.role);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3️⃣ Fetch only THIS student's assignments
    const studentObjectId = session.userId || session.id;

    console.log("🎯 Using studentId for query:", studentObjectId);

    const assignments = await Assignment.find({
      studentId: studentObjectId
    }).sort({ submittedAt: -1 });

    console.log("📦 Assignments found:", assignments.length);

    return NextResponse.json(assignments, { status: 200 });

  } catch (error) {
    console.error("🔥 Student submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}