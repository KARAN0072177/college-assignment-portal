"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileIcon,
  Book,
  User,
  Calendar,
  Award,
  HelpCircle,
  Paperclip,
  Trash2,
  Eye,
  Download,
  ChevronRight,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";

interface SubmissionHistory {
  _id: string;
  id: string;
  title: string;
  subject: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'pending';
  grade?: string;
  feedback?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

interface SubmissionStats {
  total: number;
  graded: number;
  pending: number;
  averageGrade?: string;
}

export default function StudentDashboard() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistory[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({ total: 0, graded: 0, pending: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  const subjects = [
    "Mathematics",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Art"
  ];

  const steps = [
    { id: 1, label: "Subject", icon: Book },
    { id: 2, label: "Details", icon: FileText },
    { id: 3, label: "Upload", icon: Upload },
    { id: 4, label: "Submit", icon: CheckCircle }
  ];

  // Fetch actual submission history
  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await fetch("/api/student/submissions");
        const data = await res.json();

        if (res.ok) {
          const submissionsArray = Array.isArray(data.submissions) ? data.submissions : data; // <-- fallback
          setSubmissionHistory(submissionsArray);

          // Calculate stats
          const graded = submissionsArray.filter((s: SubmissionHistory) => s.status === 'graded').length;
          const pending = submissionsArray.filter((s: SubmissionHistory) => s.status === 'submitted').length;

          const gradedSubmissions = submissionsArray.filter((s: SubmissionHistory) => s.grade && s.grade !== 'Pending');
          let averageGrade = '';
          if (gradedSubmissions.length > 0) {
            const gradeMap: { [key: string]: number } = {
              'A+': 4.3, 'A': 4.0, 'A-': 3.7,
              'B+': 3.3, 'B': 3.0, 'B-': 2.7,
              'C+': 2.3, 'C': 2.0, 'C-': 1.7,
              'D+': 1.3, 'D': 1.0, 'F': 0.0
            };
            const totalPoints = gradedSubmissions.reduce((sum: number, s: SubmissionHistory) => {
              return sum + (gradeMap[s.grade!] || 0);
            }, 0);
            const avgPoints = totalPoints / gradedSubmissions.length;
            if (avgPoints >= 4.0) averageGrade = 'A';
            else if (avgPoints >= 3.7) averageGrade = 'A-';
            else if (avgPoints >= 3.3) averageGrade = 'B+';
            else if (avgPoints >= 3.0) averageGrade = 'B';
            else if (avgPoints >= 2.7) averageGrade = 'B-';
            else if (avgPoints >= 2.3) averageGrade = 'C+';
            else if (avgPoints >= 2.0) averageGrade = 'C';
            else if (avgPoints >= 1.7) averageGrade = 'C-';
            else if (avgPoints >= 1.3) averageGrade = 'D+';
            else if (avgPoints >= 1.0) averageGrade = 'D';
            else averageGrade = 'F';
          }

          setStats({
            total: submissionsArray.length,
            graded,
            pending,
            averageGrade
          });

          setRecentSubmissions(submissionsArray.slice(0, 5));
        } else {
          setSubmissionHistory([]);
          setRecentSubmissions([]);
        }
      } catch (error) {
        console.error("Failed to fetch submission history:", error);
        setMessage({ text: "Failed to load submission history", type: "error" });
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchSubmissionHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ text: "File size must be less than 10MB", type: "error" });
        setFile(null);
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        setMessage({ text: "Only PDF and DOC/DOCX files are allowed", type: "error" });
        setFile(null);
        return;
      }

      setMessage({ text: "", type: "" });
      setActiveStep(4);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validation
    if (!subject) {
      setMessage({ text: "Please select a subject", type: "error" });
      setActiveStep(1);
      return;
    }

    if (!title.trim()) {
      setMessage({ text: "Please enter assignment title", type: "error" });
      setActiveStep(2);
      return;
    }

    if (!file) {
      setMessage({ text: "Please upload a file", type: "error" });
      setActiveStep(3);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch("/api/assignments", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Add to submission history
      const newSubmission: SubmissionHistory = {
        id: data.id || Date.now().toString(),
        title,
        subject,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        grade: 'Pending',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        _id: ""
      };

      setSubmissionHistory(prev => [newSubmission, ...prev]);
      setRecentSubmissions(prev => [newSubmission, ...prev.slice(0, 4)]);

      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1
      }));

      setMessage({ text: "🎉 Assignment submitted successfully!", type: "success" });

      // Reset form
      setTitle("");
      setSubject("");
      setDescription("");
      setFile(null);
      setActiveStep(1);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Auto-clear success message
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Failed to submit assignment", type: "error" });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    if (fileName?.includes('.pdf')) return '📄';
    if (fileName?.includes('.doc')) return '📝';
    return '📎';
  };

  const toggleSubmissionExpansion = (submissionId: string) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  const handleDownloadFile = async (submissionId: string) => {
    try {
      // Fetch download URL from API
      const res = await fetch(`/api/student/submissions/${submissionId}/download`);
      const data = await res.json();

      if (res.ok && data.url) {
        window.open(data.url, '_blank');
      } else {
        setMessage({ text: "Failed to download file", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error downloading file", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-6 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Student Dashboard</span>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium whitespace-nowrap">
                  Submit Assignments
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Submit your assignments and track submission history
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border whitespace-nowrap">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm sm:text-base">Student Portal</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Submission Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200"
            >
              {/* Progress Steps - Responsive */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    New Assignment Submission
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500">Step {activeStep} of 4</span>
                </div>

                {/* Mobile Steps - Compact */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between mb-2">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                          ${activeStep >= step.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                          }
                        `}>
                          {step.id}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Steps */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-4 gap-4 mb-2">
                    {steps.map((step) => (
                      <div key={step.id} className="text-center">
                        <div className={`
                          mx-auto w-10 h-10 rounded-full flex items-center justify-center
                          ${activeStep >= step.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                          }
                          transition-all duration-300
                        `}>
                          <step.icon className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    {steps.map((step) => (
                      <span
                        key={step.id}
                        className={`font-medium ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        {step.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Subject Selection */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeStep >= 1 ? 1 : 0.5,
                  }}
                >
                  <label className="block mb-4">
                    <span className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      Subject *
                    </span>
                    <select
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (e.target.value && activeStep === 1) setActiveStep(2);
                      }}
                      required
                      className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      onFocus={() => setActiveStep(1)}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subj) => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </label>
                </motion.div>

                {/* Step 2: Assignment Details */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeStep >= 2 ? 1 : 0.5,
                  }}
                  className="space-y-4"
                >
                  <label className="block">
                    <span className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      Assignment Title *
                    </span>
                    <input
                      type="text"
                      placeholder="e.g., Linear Algebra Problem Set"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      onFocus={() => setActiveStep(2)}
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <Book className="w-4 h-4 sm:w-5 sm:h-5" />
                      Description
                      <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                    </span>
                    <textarea
                      placeholder="Describe your assignment, include any special requirements or notes for the teacher..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      onFocus={() => setActiveStep(2)}
                    />
                  </label>
                </motion.div>

                {/* Step 3: File Upload */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeStep >= 3 ? 1 : 0.5,
                  }}
                >
                  <label className="block">
                    <span className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                      Upload Assignment File *
                    </span>

                    <div className="mt-2">
                      {/* Drag and drop area */}
                      <div
                        className={`
                          border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer
                          transition-all duration-300
                          ${file
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }
                        `}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {file ? (
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-2xl sm:text-3xl">{getFileIcon(file.name)}</span>
                              <div className="text-left min-w-0">
                                <p className="font-medium text-gray-800 truncate text-sm sm:text-base">{file.name}</p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {formatFileSize(file.size)} • {file.type.includes('pdf') ? 'PDF' : 'DOC/DOCX'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                              }}
                              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 sm:space-y-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 text-sm sm:text-base">Click to upload or drag and drop</p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                PDF or DOC/DOCX files (Max size: 10MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload progress */}
                      {loading && uploadProgress > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              className="bg-blue-600 h-1.5 sm:h-2 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: activeStep >= 4 ? 1 : 0.5,
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl"
                    onClick={() => setActiveStep(4)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Submit Assignment</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Help Text */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p>
                      Need help? Make sure your file is properly formatted and clearly labeled.
                      Double-check the subject and title before submission.
                    </p>
                  </div>
                </div>
              </form>

              {/* Message Display */}
              <AnimatePresence>
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 ${message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span className="text-sm sm:text-base">{message.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Stats & History */}
          <div className="space-y-6 md:space-y-8">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Your Stats
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Submissions</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Graded</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.graded}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Pending Review</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.pending}</p>
                    </div>
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                </div>

                {stats.averageGrade && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Average Grade</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.averageGrade}</p>
                      </div>
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Submissions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Recent Submissions
                </h3>
                {recentSubmissions.length > 3 && (
                  <button
                    onClick={() => setExpandedSubmission(null)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All ({submissionHistory.length})
                  </button>
                )}
              </div>

              {loadingHistory ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : recentSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {recentSubmissions.slice(0, 5).map((submission) => (
                    <div key={submission._id || submission.id} className="border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                      <div
                        className="p-3 cursor-pointer"
                        onClick={() => toggleSubmissionExpansion(submission.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{submission.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600 font-medium">{submission.subject}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(submission.submittedAt), 'MMM d')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${submission.status === 'graded'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                              }
                            `}>
                              {submission.status === 'graded' ? 'Graded' : 'Pending'}
                            </span>
                            {expandedSubmission === submission.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedSubmission === submission.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 pb-3 border-t border-gray-100"
                          >
                            <div className="pt-3 space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Submitted:</span>
                                <span className="text-gray-800">
                                  {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                                </span>
                              </div>

                              {submission.fileName && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">File:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-800 truncate max-w-[120px] sm:max-w-[150px]">
                                      {submission.fileName}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadFile(submission.id);
                                      }}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {submission.grade && submission.grade !== 'Pending' && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Grade:</span>
                                  <span className="font-bold text-gray-800">{submission.grade}</span>
                                </div>
                              )}

                              {submission.feedback && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Feedback:</p>
                                  <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                    {submission.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base">No submissions yet</p>
                  <p className="text-xs sm:text-sm mt-1">Submit your first assignment to see it here</p>
                </div>
              )}
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg sm:shadow-xl p-4 sm:p-6 text-white"
            >
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Submission Tips
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Name files clearly: LastName_Title.pdf</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Check file size before uploading</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Include name and student ID in document</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Submit before deadline</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm"
        >
          <p>© {new Date().getFullYear()} Educational Portal • Student Dashboard</p>
          <p className="mt-1">Need technical support? Contact help@eduportal.edu</p>
        </motion.div>
      </div>
    </div>
  );
}