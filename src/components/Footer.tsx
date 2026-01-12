'use client';

import Link from 'next/link';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
  Heart,
  Shield,
  Globe,
  BookOpen,
  Users
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">EduPortal</h2>
                <p className="text-sm text-gray-400 mt-1">Academic Excellence Platform</p>
              </div>
            </Link>
            <p className="mt-6 text-gray-400 text-sm leading-relaxed">
              A modern platform designed to streamline academic workflows, enhance collaboration,
              and empower students and educators worldwide.
            </p>

            {/* Newsletter Subscription */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-white mb-3">Stay Updated</h3>
              <div className="flex">
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button suppressHydrationWarning className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-r-lg transition-all group">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Student Dashboard', href: '/student' },
                { label: 'Teacher Dashboard', href: '/teacher' },
                { label: 'Assignment Guidelines', href: '#' },
                { label: 'Academic Calendar', href: '#' },
                { label: 'Resource Library', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', href: '#' },
                { label: 'Documentation', href: '#' },
                { label: 'Video Tutorials', href: '#' },
                { label: 'API Documentation', href: '#' },
                { label: 'System Status', href: '#' },
                { label: 'Release Notes', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-amber-400" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href="mailto:support@eduportal.ac"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    support@eduportal.ac
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a
                    href="tel:+11234567890"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">123 University Ave, Academic City</p>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' },
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Youtube, label: 'YouTube', href: '#' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:scale-110 transition-all duration-200 group"
                  >
                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-400">GDPR Compliant</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                © {currentYear} EduPortal. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Designed for academic excellence <Heart className="inline h-3 w-3 text-red-400 mx-1" /> worldwide.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>v2.4.1</span>
              <span className="hidden sm:inline">•</span>
              <span>Built with Next.js & Tailwind CSS</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                System Status: <span className="text-green-400 ml-1">All Systems Operational</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        suppressHydrationWarning
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center group"
        aria-label="Back to top"
      >
        <ArrowRight className="h-5 w-5 transform -rotate-90 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
};

export default Footer;