"use client";

import { useState } from "react";
import { User, Mail, Lock, GraduationCap, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Registration failed. Please try again.");
        return;
      }

      setMessage("Registration successful! You can now login.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
    } catch (error) {
      setMessage("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side - Form */}
        <div className="lg:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">University Portal</h1>
                <p className="text-sm text-gray-600">Create your academic account</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                University Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="john.smith@university.edu"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">Use your university email address</p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-gray-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters with letters and numbers</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 rounded-xl border-2 transition-all ${role === "student" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === "student" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Student</p>
                      <p className="text-xs text-gray-500">Access courses & resources</p>
                    </div>
                    {role === "student" && (
                      <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-4 rounded-xl border-2 transition-all ${role === "teacher" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === "teacher" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Teacher</p>
                      <p className="text-xs text-gray-500">Manage courses & students</p>
                    </div>
                    {role === "teacher" && (
                      <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all ${
                isLoading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
              message.includes("successful") 
                ? "bg-green-50 border border-green-200" 
                : "bg-red-50 border border-red-200"
            }`}>
              {message.includes("successful") ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                message.includes("successful") ? "text-green-800" : "text-red-800"
              }`}>
                {message}
              </p>
            </div>
          )}

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Sign in here
            </a>
          </p>
        </div>

        {/* Right Side - Information */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-white">
          <div className="h-full flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Why Join Our University Portal?</h2>
              <p className="text-blue-100 opacity-90">
                Access exclusive academic resources, connect with peers and faculty, and manage your educational journey in one secure platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Course Management</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    Access all your courses, assignments, and materials in one place
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Faculty Collaboration</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    Connect with professors and teaching assistants seamlessly
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Personal Dashboard</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    Track your progress, grades, and academic achievements
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/20">
              <h4 className="font-semibold mb-3">Secure & Private</h4>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Encrypted Data</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Role-Based Access</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">University Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Responsive Adjustments */}
      <div className="fixed bottom-4 left-4 lg:hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <p className="text-xs text-gray-600">For best experience, view on desktop or tablet</p>
        </div>
      </div>
    </div>
  );
}