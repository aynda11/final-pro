"use client";

import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft, Calendar, Clock, Monitor, ExternalLink, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ScheduledInterviewsPage() {
  const router = useRouter();

  // Mock data - in a real app, this would come from an API
  const interviews = [
    {
      id: 1,
      candidateName: "John Doe",
      position: "Software Engineering Intern",
      interviewDate: "2023-11-20",
      interviewTime: "14:00",
      interviewType: "Virtual",
      meetingLink: "https://meet.google.com/abc-def-ghi",
      status: "Scheduled",
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      position: "Data Science Intern",
      interviewDate: "2023-11-21",
      interviewTime: "10:00",
      interviewType: "In-Person",
      location: "Tech Corp HQ, Room 101",
      status: "Scheduled",
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scheduled Interviews</h1>
          </div>

          <div className="grid gap-6">
            {interviews.map((interview) => (
              <div key={interview.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{interview.candidateName}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{interview.position}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {interview.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(interview.interviewDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{interview.interviewTime}</span>
                    <span>•</span>
                    <Monitor className="w-4 h-4" />
                    <span>{interview.interviewType}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/dashboard/company/review-application/${interview.id}`}>
                    <Button 
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      View Application
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 