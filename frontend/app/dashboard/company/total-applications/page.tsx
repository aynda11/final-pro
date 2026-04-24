"use client";

import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft, GraduationCap, BookOpen, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TotalApplicationsPage() {
  const router = useRouter();

  // Mock data - in a real app, this would come from an API
  const applications = [
    {
      id: 1,
      candidateName: "John Doe",
      position: "Software Engineering Intern",
      university: "Stanford University",
      major: "Computer Science",
      applicationDate: "2023-11-15",
      status: "New",
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      position: "Data Science Intern",
      university: "MIT",
      major: "Data Science",
      applicationDate: "2023-11-14",
      status: "Under Review",
    },
    {
      id: 3,
      candidateName: "Alex Johnson",
      position: "Software Engineering Intern",
      university: "UC Berkeley",
      major: "Computer Science",
      applicationDate: "2023-11-13",
      status: "Interview Scheduled",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="bg-white dark:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Applications</h1>
          </div>

          <div className="grid gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold text-[#9d4edd] dark:text-white text-xl">{application.candidateName}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{application.position}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    application.status === "New" ? "bg-blue-100 text-blue-800" :
                    application.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {application.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>{application.university}</span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{application.major}</span>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>Applied {new Date(application.applicationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/dashboard/company/review-application/${application.id}`}>
                    <Button 
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Review Application
                    </Button>
                  </Link>
                  <Link href={`/dashboard/company/schedule-interviews?applicationId=${application.id}`}>
                    <Button 
                      variant="outline" 
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Schedule Interview
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 