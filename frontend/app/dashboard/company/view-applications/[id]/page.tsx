"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";

export default function ViewApplicationsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Mock data - in a real app, this would come from an API
  const internship = {
    id: params.id,
    title: "Software Engineering Intern",
    applications: [
      {
        id: 1,
        candidateName: "John Doe",
        university: "Stanford University",
        major: "Computer Science",
        applicationDate: "2023-09-01",
        status: "New",
      },
      {
        id: 2,
        candidateName: "Jane Smith",
        university: "MIT",
        major: "Computer Science",
        applicationDate: "2023-09-02",
        status: "Under Review",
      },
      {
        id: 3,
        candidateName: "Alex Johnson",
        university: "UC Berkeley",
        major: "Software Engineering",
        applicationDate: "2023-09-03",
        status: "Interview Scheduled",
      },
    ],
  };

  const handleReviewApplication = (applicationId: number) => {
    router.push(`/dashboard/company/review-application/${applicationId}`);
  };

  const handleScheduleInterview = (applicationId: number) => {
    router.push(`/dashboard/company/schedule-interviews?applicationId=${applicationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Applications for {internship.title}
            </h1>
            
            <div className="space-y-4">
              {internship.applications.map((application) => (
                <div key={application.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {application.candidateName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {application.university} • {application.major}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === "New" ? "bg-blue-100 text-blue-800" :
                      application.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>📅 Applied {application.applicationDate}</span>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleReviewApplication(application.id)}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Review Application
                    </Button>
                    <Button
                      onClick={() => handleScheduleInterview(application.id)}
                      variant="outline"
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Schedule Interview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 