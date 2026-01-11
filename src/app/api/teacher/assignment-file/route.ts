import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(req: Request) {
    try {
        // 1️⃣ Auth check
        const sessionCookie = (await cookies()).get("session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie);
        if (session.role !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2️⃣ Read s3Key from query
        const { searchParams } = new URL(req.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json(
                { error: "Missing file key" },
                { status: 400 }
            );
        }

        // 3️⃣ Generate signed URL
        const mode = searchParams.get("mode"); // "view" | "download"

        const disposition =
            mode === "download"
                ? `attachment; filename="${key.split("/").pop()}"`
                : `inline; filename="${key.split("/").pop()}"`;

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            ResponseContentDisposition: disposition,
        });

        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 60 * 5, // 5 minutes
        });

        return NextResponse.json({ url: signedUrl });
    } catch (err) {
        console.error("Signed URL error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}