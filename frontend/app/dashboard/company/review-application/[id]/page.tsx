"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";

export default function ReviewApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [reviewNotes, setReviewNotes] = useState("");
  const [decision, setDecision] = useState<"accept" | "reject" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock application data - in a real app, this would come from an API
  const application = {
    id: params.id,
    candidateName: "John Doe",
    position: "Software Engineering Intern",
    university: "Stanford University",
    major: "Computer Science",
    applicationDate: "2023-09-01",
    resume: "resume.pdf",
    coverLetter: "I am excited to apply for the Software Engineering Intern position...",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    
    // Redirect back to company dashboard
    router.push("/dashboard/company");
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

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Review Application
            </h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Application Details</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-medium">Candidate Name</p>
                    <p>{application.candidateName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Position</p>
                    <p>{application.position}</p>
                  </div>
                  <div>
                    <p className="font-medium">University</p>
                    <p>{application.university}</p>
                  </div>
                  <div>
                    <p className="font-medium">Major</p>
                    <p>{application.major}</p>
                  </div>
                  <div>
                    <p className="font-medium">Application Date</p>
                    <p>{application.applicationDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Cover Letter</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Review Notes</h2>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter your review notes here..."
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setDecision("accept")}
                  className={`flex-1 ${
                    decision === "accept"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  disabled={isSubmitting}
                >
                  Accept Application
                </Button>
                <Button
                  onClick={() => setDecision("reject")}
                  className={`flex-1 ${
                    decision === "reject"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  disabled={isSubmitting}
                >
                  Reject Application
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400"
                disabled={!decision || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 