import Link from 'next/link';
import { GraduationCap, BookOpen, Users, Shield, ArrowRight, CheckCircle, Clock, BarChart, MessageSquare, Award, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center justify-center p-2 px-4 bg-blue-100 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">College Assignment Portal</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Streamline Your
            <span className="block text-blue-600 mt-2">Academic Journey</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            A modern platform for students to submit assignments and teachers to review them efficiently. 
            Simple, secure, and designed for academic excellence.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-blue-700 bg-white rounded-lg hover:bg-gray-50 transition-all border-2 border-blue-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-sm text-gray-600 mt-1">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600 mt-1">Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Built for Academic Success</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage assignments effectively, whether you're a student or educator.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Easy Assignment Submission</h3>
              <p className="mt-2 text-gray-600">
                Submit assignments in seconds with our intuitive interface. Track submission status and deadlines effortlessly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Seamless Teacher Review</h3>
              <p className="mt-2 text-gray-600">
                Teachers can efficiently review, grade, and provide feedback on submissions from a centralized dashboard.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Secure & Private</h3>
              <p className="mt-2 text-gray-600">
                Enterprise-grade security ensures your academic work and personal data are always protected.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Deadline Management</h3>
              <p className="mt-2 text-gray-600">
                Never miss a deadline with automated reminders and clear visibility of upcoming submissions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Progress Tracking</h3>
              <p className="mt-2 text-gray-600">
                Students can track their academic progress with detailed analytics and performance insights.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Direct Feedback</h3>
              <p className="mt-2 text-gray-600">
                Teachers can provide personalized feedback directly on submissions, fostering better learning outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Platform?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Designed with both students and educators in mind for a superior academic experience.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  {
                    icon: CheckCircle,
                    title: "User-Friendly Interface",
                    description: "Intuitive design that requires minimal training for both students and teachers."
                  },
                  {
                    icon: CheckCircle,
                    title: "Real-time Updates",
                    description: "Instant notifications for submissions, grades, and important announcements."
                  },
                  {
                    icon: CheckCircle,
                    title: "Mobile Responsive",
                    description: "Access your dashboard from any device, anywhere, at any time."
                  },
                  {
                    icon: CheckCircle,
                    title: "Data Analytics",
                    description: "Comprehensive insights into submission patterns and academic performance."
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Trusted by Institutions</h3>
                <p className="mt-3 text-gray-600">
                  Join hundreds of educational institutions that rely on our platform for streamlined assignment management.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">For Students</div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li>• Easy submission</li>
                    <li>• Track progress</li>
                    <li>• Get feedback</li>
                    <li>• Meet deadlines</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">For Teachers</div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li>• Efficient review</li>
                    <li>• Grade management</li>
                    <li>• Provide feedback</li>
                    <li>• Track submissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">About Our Mission</h2>
              <p className="text-lg opacity-90 mb-6">
                We believe technology should enhance education, not complicate it. Our platform was created to simplify 
                the assignment management process, allowing students to focus on learning and teachers to focus on teaching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-all"
                >
                  Join Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-white/20 rounded-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  See Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900">Ready to Transform Academic Management?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of students and teachers who have streamlined their academic workflow.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-700 bg-white rounded-lg hover:bg-gray-50 transition-all border-2 border-blue-200 shadow-sm hover:shadow-md"
            >
              Sign In to Dashboard
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            No credit card required • Free for educational institutions • 24/7 support
          </p>
        </div>
      </div>
    </div>
  );
}