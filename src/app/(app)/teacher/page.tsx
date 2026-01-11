"use client";

import { useEffect, useState } from "react";

interface Assignment {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  submittedAt: string;
  s3Key: string;
  studentId: {
    name: string;
    email: string;
  };
}

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/teacher/assignments");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load assignments");
          return;
        }

        setAssignments(data);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const openFile = async (s3Key: string, mode: "view" | "download") => {
    const res = await fetch(
      `/api/teacher/assignment-file?key=${encodeURIComponent(
        s3Key
      )}&mode=${mode}`
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to access file");
      return;
    }

    window.open(data.url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">
          Teacher Dashboard
        </h1>

        {/* States */}
        {loading && <p>Loading assignments...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && assignments.length === 0 && (
          <p>No assignments submitted yet.</p>
        )}

        {!loading && assignments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Submitted At</th>
                  <th className="p-3 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{a.studentId.name}</td>
                    <td className="p-3">{a.studentId.email}</td>
                    <td className="p-3">{a.subject}</td>
                    <td className="p-3">{a.title}</td>
                    <td className="p-3">
                      {new Date(a.submittedAt).toLocaleString()}
                    </td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => openFile(a.s3Key, "view")}
                        className="text-green-700 hover:underline"
                      >
                        👀 View
                      </button>

                      <button
                        onClick={() => openFile(a.s3Key, "download")}
                        className="text-blue-700 hover:underline"
                      >
                        ⬇️ Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}