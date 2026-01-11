"use client";

import { useEffect, useState } from "react";
import { 
  Download, 
  Eye, 
  FileText, 
  User, 
  Mail, 
  BookOpen, 
  Calendar, 
  AlertCircle,
  Loader2,
  Search,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";

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

interface FilterState {
  subject: string;
  student: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    subject: "",
    student: "",
    dateRange: { start: null, end: null }
  });
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    subjects: new Set<string>(),
    students: new Set<string>()
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/teacher/assignments");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load assignments");
          return;
        }

        setAssignments(data);
        setFilteredAssignments(data);
        
        // Calculate stats
        const subjects = new Set<string>();
        const students = new Set<string>();
        data.forEach((assignment: Assignment) => {
          subjects.add(assignment.subject);
          students.add(assignment.studentId.email);
        });
        
        setStats({
          total: data.length,
          subjects,
          students
        });
      } catch (err) {
        setError("Failed to load assignments. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = assignments;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(assignment =>
        assignment.title.toLowerCase().includes(term) ||
        assignment.subject.toLowerCase().includes(term) ||
        assignment.studentId.name.toLowerCase().includes(term) ||
        assignment.studentId.email.toLowerCase().includes(term) ||
        assignment.description?.toLowerCase().includes(term)
      );
    }

    // Apply subject filter
    if (filters.subject) {
      result = result.filter(assignment => assignment.subject === filters.subject);
    }

    // Apply student filter
    if (filters.student) {
      result = result.filter(assignment => assignment.studentId.email === filters.student);
    }

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(assignment => {
        const submittedDate = new Date(assignment.submittedAt);
        return submittedDate >= filters.dateRange.start! &&
               submittedDate <= filters.dateRange.end!;
      });
    }

    setFilteredAssignments(result);
  }, [assignments, searchTerm, filters]);

  const handleFileAction = async (s3Key: string, mode: "view" | "download") => {
    try {
      setIsProcessingFile(s3Key);
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
    } catch (err) {
      alert("An error occurred while accessing the file");
    } finally {
      setIsProcessingFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  const toggleAssignmentExpansion = (assignmentId: string) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      subject: "",
      student: "",
      dateRange: { start: null, end: null }
    });
    setShowFilters(false);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and manage student submissions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          {[
            { 
              title: "Total Submissions", 
              value: stats.total, 
              icon: FileText, 
              color: "blue",
              bgColor: "bg-blue-50"
            },
            { 
              title: "Subjects", 
              value: stats.subjects.size, 
              icon: BookOpen, 
              color: "green",
              bgColor: "bg-green-50"
            },
            { 
              title: "Students", 
              value: stats.students.size, 
              icon: User, 
              color: "purple",
              bgColor: "bg-purple-50"
            },
            { 
              title: "Today's Submissions", 
              value: assignments.filter(a => 
                new Date(a.submittedAt).toDateString() === new Date().toDateString()
              ).length, 
              icon: Clock, 
              color: "yellow",
              bgColor: "bg-yellow-50"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 mb-6 md:mb-8 border border-gray-200"
        >
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 md:hidden"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>

            {/* Filters - Mobile Toggle */}
            <div className="flex items-center justify-between md:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-gray-600 font-medium"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {(searchTerm || filters.subject || filters.student) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filters Content */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 768) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={filters.subject}
                        onChange={(e) => setFilters({...filters, subject: e.target.value})}
                      >
                        <option value="">All Subjects</option>
                        {Array.from(stats.subjects).map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={filters.student}
                        onChange={(e) => setFilters({...filters, student: e.target.value})}
                      >
                        <option value="">All Students</option>
                        {Array.from(stats.students).map(email => {
                          const student = assignments.find(a => a.studentId.email === email)?.studentId;
                          return (
                            <option key={email} value={email}>
                              {student?.name.split(' ')[0]} ({email.substring(0, 10)}...)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex items-end gap-2">
                      <button
                        onClick={clearFilters}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Filter className="w-4 h-4" />
              <span>{filteredAssignments.length} assignments found</span>
            </div>
            {stats.total > 0 && (
              <button
                onClick={() => {
                  alert("Export functionality coming soon!");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Export to CSV
              </button>
            )}
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-red-800 text-sm sm:text-base">Error Loading Assignments</h3>
                    <p className="text-red-600 text-xs sm:text-sm mt-1 truncate">{error}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="ml-3 text-red-700 hover:text-red-800 text-sm font-medium flex-shrink-0"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && assignments.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No Assignments Submitted Yet
            </h3>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
              When students submit their assignments, they will appear here for review and grading.
            </p>
          </motion.div>
        )}

        {/* Assignments List/Table */}
        {!loading && filteredAssignments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm sm:shadow-md overflow-hidden border border-gray-200"
          >
            {/* Mobile Cards View */}
            <div className="md:hidden">
              <AnimatePresence>
                {filteredAssignments.map((assignment, index) => (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getFileIcon(assignment.fileType)}</span>
                          <h4 className="font-medium text-gray-900 truncate">{assignment.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded truncate max-w-[120px]">
                            {assignment.fileName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(assignment.fileSize)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAssignmentExpansion(assignment._id)}
                        className="p-1 hover:bg-gray-100 rounded transition ml-2"
                      >
                        {expandedAssignment === assignment._id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">{assignment.studentId.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{assignment.studentId.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {assignment.subject}
                      </span>
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{format(new Date(assignment.submittedAt), 'MMM dd')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFileAction(assignment.s3Key, "view")}
                        disabled={isProcessingFile === assignment.s3Key}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 text-sm"
                      >
                        {isProcessingFile === assignment.s3Key ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        View
                      </button>
                      <button
                        onClick={() => handleFileAction(assignment.s3Key, "download")}
                        disabled={isProcessingFile === assignment.s3Key}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition disabled:opacity-50 text-sm"
                      >
                        {isProcessingFile === assignment.s3Key ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        Download
                      </button>
                    </div>

                    {/* Expanded Content Mobile */}
                    <AnimatePresence>
                      {expandedAssignment === assignment._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">Description</h5>
                              <p className="text-sm text-gray-600">
                                {assignment.description || "No description provided."}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">File Info</h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Type:</span>
                                  <span className="font-medium">{assignment.fileType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Size:</span>
                                  <span className="font-medium">{formatFileSize(assignment.fileSize)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[768px]">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold text-sm">Assignment</th>
                    <th className="p-4 text-left font-semibold text-sm">Student</th>
                    <th className="p-4 text-left font-semibold text-sm">Subject</th>
                    <th className="p-4 text-left font-semibold text-sm">Submitted</th>
                    <th className="p-4 text-left font-semibold text-sm">Actions</th>
                    <th className="p-4 text-left font-semibold text-sm w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredAssignments.map((assignment, index) => (
                      <motion.tr
                        key={assignment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{getFileIcon(assignment.fileType)}</span>
                              <div className="min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{assignment.title}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded truncate max-w-[200px]">
                                    {assignment.fileName}
                                  </span>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatFileSize(assignment.fileSize)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">{assignment.studentId.name}</div>
                            <div className="flex items-center text-sm text-gray-500 mt-1 truncate">
                              <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                              {assignment.studentId.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium whitespace-nowrap">
                            {assignment.subject}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="whitespace-nowrap">{format(new Date(assignment.submittedAt), 'MMM dd, yyyy')}</div>
                              <div className="text-gray-400 text-xs whitespace-nowrap">
                                {formatDistanceToNow(new Date(assignment.submittedAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleFileAction(assignment.s3Key, "view")}
                              disabled={isProcessingFile === assignment.s3Key}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 text-sm"
                            >
                              {isProcessingFile === assignment.s3Key ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                              View
                            </button>
                            <button
                              onClick={() => handleFileAction(assignment.s3Key, "download")}
                              disabled={isProcessingFile === assignment.s3Key}
                              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition disabled:opacity-50 text-sm"
                            >
                              {isProcessingFile === assignment.s3Key ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              Download
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleAssignmentExpansion(assignment._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            {expandedAssignment === assignment._id ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Expanded Assignment Details - Desktop */}
        <AnimatePresence>
          {expandedAssignment && window.innerWidth >= 768 && (() => {
            const assignment = assignments.find(a => a._id === expandedAssignment);
            if (!assignment) return null;
            
            return (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-xl shadow-md p-6 border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Assignment Details</h4>
                    <p className="text-gray-600">{assignment.description || "No description provided."}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">File Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Type:</span>
                        <span className="font-medium">{assignment.fileType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium">{formatFileSize(assignment.fileSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submission ID:</span>
                        <span className="font-mono text-sm truncate max-w-[200px]">{assignment._id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 md:mt-8 text-center text-gray-500 text-xs sm:text-sm"
        >
          <p>© {new Date().getFullYear()} Educational Portal • Teacher Dashboard</p>
          <p className="mt-1">Showing {filteredAssignments.length} of {stats.total} submissions</p>
        </motion.div>
      </div>
    </div>
  );
}