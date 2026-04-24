"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock job data - in a real app, this would come from an API
  const job = {
    id: params?.id as string,
    position: "Software Engineering Intern",
    company: "Tech Solutions Kurdistan",
    location: "Erbil, Kurdistan",
    description: "Looking for a passionate developer with experience in modern web technologies...",
    requirements: [
      "Strong knowledge of React and TypeScript",
      "Experience with Node.js and SQL",
      "Good understanding of REST APIs",
      "Ability to work in a team environment"
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSuccess(true);
    
    // Redirect to student dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard/student");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4 text-[#6930c3] dark:text-[#b185db]">
              {job.position}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {job.company} • {job.location}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {job.description}
            </p>
            
            <h2 className="text-xl font-semibold mb-4 text-[#6930c3] dark:text-[#b185db]">
              Requirements
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-[#6930c3] dark:text-[#b185db]">
                Submit Your Application
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Cover Letter
                  </label>
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're the perfect candidate for this position..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Resume
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                      required
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-[#5e60ce] rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {resume ? resume.name : "Upload Resume"}
                      </span>
                    </label>
                    {resume && (
                      <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        File selected
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h2 className="text-2xl font-bold text-[#6930c3] dark:text-[#b185db]">
                  Application Submitted!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your application has been successfully submitted. Redirecting to your applications...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 