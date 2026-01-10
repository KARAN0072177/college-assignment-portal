"use client";

import { useState, useEffect } from "react";
import { Upload, BookOpen, Calendar, CheckCircle, FileText, Clock, AlertCircle, Book, User, TrendingUp, Paperclip, Eye } from "lucide-react";

interface SubmittedAssignment {
  _id: string;
  title: string;
  subject: string;
  createdAt: string;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
}

export default function StudentDashboard() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAssignments, setSubmittedAssignments] = useState<SubmittedAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");

  // Fetch submitted assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/student/assignments");
        if (res.ok) {
          const data = await res.json();
          setSubmittedAssignments(data);
        }
      } catch (error) {
        console.error("Failed to fetch assignments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to submit assignment");
        return;
      }

      // Add the new assignment to the list
      const newAssignment: SubmittedAssignment = {
        _id: data._id,
        title,
        subject,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setSubmittedAssignments(prev => [newAssignment, ...prev]);
      setMessage("Assignment submitted successfully ✅");
      setTitle("");
      setSubject("");
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Statistics
  const stats = {
    total: submittedAssignments.length,
    pending: submittedAssignments.filter(a => a.status === 'pending').length,
    graded: submittedAssignments.filter(a => a.status === 'graded').length,
    averageGrade: submittedAssignments.filter(a => a.grade).reduce((acc, curr) => acc + (curr.grade || 0), 0) / submittedAssignments.filter(a => a.grade).length || 0
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const subjectSuggestions = ["Mathematics", "Physics", "Computer Science", "English", "History", "Chemistry", "Biology"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Submit assignments and track your academic progress</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">John Smith</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold">JS</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Graded</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.graded}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.averageGrade ? stats.averageGrade.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Submission Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "submit"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Submit Assignment</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
                      activeTab === "history"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <HistoryIcon />
                      <span>Submission History</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {activeTab === "submit" ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Computer Science, Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        list="subject-suggestions"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <datalist id="subject-suggestions">
                        {subjectSuggestions.map((subject) => (
                          <option key={subject} value={subject} />
                        ))}
                      </datalist>
                      <p className="mt-1 text-xs text-gray-500">Select or type your subject</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Assignment Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Data Structures Final Project, Calculus Homework 3"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500">Be descriptive about your assignment</p>
                    </div>

                    {/* File Upload Simulation */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Drag & drop your files here
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        or click to browse (PDF, DOC, ZIP up to 50MB)
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Browse Files
                      </button>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        placeholder="Add any additional information for your teacher..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Upload className="h-5 w-5" />
                          <span>Submit Assignment</span>
                        </div>
                      )}
                    </button>
                  </form>
                ) : (
                  /* History Tab */
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading submission history...</p>
                      </div>
                    ) : submittedAssignments.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No submissions yet</h3>
                        <p className="text-gray-600">Submit your first assignment to see it here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {submittedAssignments.map((assignment) => (
                          <div
                            key={assignment._id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{assignment.title}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    assignment.status === 'graded'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {assignment.status === 'graded' ? 'Graded' : 'Pending'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Submitted {formatDate(assignment.createdAt)}
                                </div>
                                {assignment.grade && (
                                  <div className="mt-2 flex items-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      Grade: <span className="text-green-600">{assignment.grade}/100</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Eye className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Display */}
                {message && (
                  <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
                    message.includes("✅") 
                      ? "bg-green-50 border border-green-200" 
                      : "bg-red-50 border border-red-200"
                  }`}>
                    {message.includes("✅") ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${message.includes("✅") ? "text-green-800" : "text-red-800"}`}>
                      {message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Information & Quick Links */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 text-sm">Advanced Mathematics</p>
                  <p className="text-xs text-blue-700">Final Project Submission</p>
                  <p className="text-xs text-blue-600 mt-1">Due in 3 days</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-medium text-amber-900 text-sm">Computer Science</p>
                  <p className="text-xs text-amber-700">Lab Report 5</p>
                  <p className="text-xs text-amber-600 mt-1">Due tomorrow</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-100 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Book className="h-5 w-5 mr-2 text-emerald-600" />
                Submission Tips
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Use descriptive titles for easier tracking</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Submit at least 24 hours before deadline</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Include all required files in one zip if needed</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Check submission history for feedback</span>
                </li>
              </ul>
            </div>

            {/* Recent Feedback */}
            {submittedAssignments.filter(a => a.feedback).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
                <div className="space-y-3">
                  {submittedAssignments
                    .filter(a => a.feedback)
                    .slice(0, 2)
                    .map(assignment => (
                      <div key={assignment._id} className="border-l-4 border-green-500 pl-3 py-1">
                        <p className="font-medium text-gray-900 text-sm">{assignment.subject}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{assignment.feedback}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// History Icon Component
function HistoryIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}