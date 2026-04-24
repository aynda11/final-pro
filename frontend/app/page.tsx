"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, GraduationCap, Search, Briefcase } from 'lucide-react';
import Navigation from "@/components/Navigation";
import CardSlider from "./components/CardSlider";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottieAnimation = () => {
  return (
    <div className="w-96 h-96 -ml-8">
      <DotLottieReact
        src="https://lottie.host/1965b7c7-78cc-4296-b16d-f8c25852f300/yHvj40eIqe.lottie"
        loop
        autoplay
      />
    </div>
  );
};

const NewLottieAnimation = () => {
  return (
    <div className="absolute left-16 bottom-4 w-40 h-40">
      <DotLottieReact
        src="https://lottie.host/c7d61f7e-6ffd-41b8-97b5-e3b0d81a4c59/3L0H5HFfiM.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      
      <main>
        {/* Hero Section with Dynamic Background */}
        <div className="relative min-h-[600px] flex items-center justify-between overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full -mt-40 ml-64">
            <h1 className="text-5xl md:text-6xl font-bold mb-1 text-center">
              <span className="inline-block animate-title-slide-up bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(20,184,166,0.3)] dark:drop-shadow-[0_0_10px_rgba(94,234,212,0.3)] animate-text-glow">
                Kickstart Your Future With Us
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl text-center">
              Showcase your skills, explore and apply for top opportunities, and track your career progress. Post job openings, review candidates, and streamline your hiring process all in one seamless platform.
            </p>
          </div>

          {/* New Lottie Animation on the Left Bottom Corner */}
          <NewLottieAnimation />

          {/* Lottie Animation on the Right */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <LottieAnimation />
          </div>
        </div>

        {/* Further Lifted Company Logos Section */}
        <section className="py-6 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent">Our Supporting Companies</h2>
            <CardSlider />
          </div>
        </section>

        {/* Featured Internships Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent">Featured Internships</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Internship Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Software Engineering Intern</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Tech Company 1</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm border border-blue-200 dark:border-blue-800">Remote</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800">$25-35/hr</span>
                      <span className="px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm border border-purple-200 dark:border-purple-800">Full-time</span>
                    </div>
                    <Link href="/login" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                      Learn more <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Internship Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Data Science Intern</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Data Company 1</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm border border-blue-200 dark:border-blue-800">On-site</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800">$30-40/hr</span>
                      <span className="px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm border border-purple-200 dark:border-purple-800">Part-time</span>
                    </div>
                    <Link href="/login" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                      Learn more <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Internship Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Marketing Intern</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Marketing Company 1</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm border border-blue-200 dark:border-blue-800">Remote</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800">$20-30/hr</span>
                      <span className="px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm border border-purple-200 dark:border-purple-800">Internship</span>
                    </div>
                    <Link href="/login" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                      Learn more <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Add more internship cards as needed */}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Follow these simple steps to kickstart your career journey.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                  <GraduationCap className="w-16 h-16" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">1. Create Your Profile</h3>
                <p className="text-gray-600 dark:text-gray-400">Sign up and showcase your skills and interests.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-cyan-600 dark:text-cyan-400">
                  <Search className="w-16 h-16" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">2. Browse Opportunities</h3>
                <p className="text-gray-600 dark:text-gray-400">Explore jobs, internships, and more tailored for you.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-purple-600 dark:text-purple-400">
                  <Briefcase className="w-16 h-16" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">3. Apply & Grow</h3>
                <p className="text-gray-600 dark:text-gray-400">Apply in a click and track your progress in one place.</p>
              </div>
            </div>
          </div>
        </section>

        {/* For Companies Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-300 dark:to-teal-300 bg-clip-text text-transparent">
              For Companies
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Here's how companies can partner with us to find top talent.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400">
                  <Building2 className="w-16 h-16" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">1. Create a Company Account</h3>
                <p className="text-gray-600 dark:text-gray-400">Sign up to post jobs and internships.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-purple-600 dark:text-purple-400">
                  <Briefcase className="w-16 h-16" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">2. Post Opportunities</h3>
                <p className="text-gray-600 dark:text-gray-400">Easily list openings and review applicants.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-cyan-600 dark:text-cyan-400">
                  <Search className="w-16 h-16" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">3. Engage Talent</h3>
                <p className="text-gray-600 dark:text-gray-400">Contact and hire the best candidates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
              Join thousands of students who have found their dream internships through CareerHub. Create your profile today and start applying!
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 text-white dark:text-gray-900 rounded-full font-medium hover:from-blue-400 hover:to-purple-400 dark:hover:from-blue-200 dark:hover:to-purple-300 transition-all duration-300"
              >
                Sign Up Now
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-3 bg-white/90 dark:bg-gray-800/50 backdrop-blur-md text-gray-700 dark:text-gray-300 rounded-full font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* Developed By Section */}
        <section className="py-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto text-center">
            <div className="text-center text-gray-600 dark:text-gray-400">
              Developed by <span className="font-semibold text-indigo-500 dark:text-indigo-300">Aya</span> & <span className="font-semibold text-indigo-500 dark:text-indigo-300">Aynde</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}