"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Shield, GraduationCap, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }

      // Redirect based on role
      if (data.role === "student") {
        router.replace("/student");
      } else {
        router.replace("/teacher");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }

    router.refresh();
  };

  const handleDemoLogin = (role: "student" | "teacher") => {
    if (role === "student") {
      setEmail("student@university.edu");
      setPassword("demo123");
    } else {
      setEmail("teacher@university.edu");
      setPassword("demo123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side - Brand & Information */}
        <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">University Portal</h1>
                  <p className="text-blue-100 text-sm">Secure Academic Platform</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
              <p className="text-blue-100 opacity-90 mb-8">
                Access your courses, connect with peers, and continue your academic journey with our secure platform.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Secure Access</h3>
                    <p className="text-blue-100 text-sm opacity-90">
                      Enterprise-grade security protecting your academic data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Unified Platform</h3>
                    <p className="text-blue-100 text-sm opacity-90">
                      All your academic tools and resources in one place
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20">
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Fully Encrypted</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">24/7 Support</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">University Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-3/5 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {/* Demo Login Buttons */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Try Demo Accounts</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student")}
                  className="flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Student Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("teacher")}
                  className="flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-indigo-700">Teacher Demo</span>
                </button>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign in with your account</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  University Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-gray-500" />
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In to Account</span>
                  </div>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 animate-fade-in">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Authentication Failed</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Create account
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                New students and faculty must register through university administration
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Security Notice</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This portal uses advanced encryption. Always ensure you're on the official university website before entering credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Notice */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 max-w-xs">
          <p className="text-xs text-gray-600">
            For security, avoid using public computers for login
          </p>
        </div>
      </div>

    </div>
  );
}