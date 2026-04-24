"use client";

import React, { useState } from 'react';
import Navigation from "@/components/Navigation";
import { CheckCircle, XCircle, Calendar, Briefcase, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MyApplications = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [detailsVisible, setDetailsVisible] = useState<number | null>(null); // State to manage which opportunity's details are visible

  const opportunities = [
    { title: "Software Engineer Intern", status: "Applied", company: "Tech Corp", date: "2023-09-01" },
    { title: "Data Analyst", status: "Interview Scheduled", company: "Data Inc", date: "2023-09-10" },
    { title: "Frontend Developer", status: "Accepted", company: "Web Solutions", date: "2023-08-15" },
    { title: "Backend Developer", status: "Not Accepted", company: "Dev House", date: "2023-07-20" },
  ];

  const categories = ['All', 'Applied', 'Interview Scheduled', 'Accepted', 'Not Accepted'];

  const filteredOpportunities = selectedCategory === 'All'
    ? opportunities
    : opportunities.filter(opportunity => opportunity.status === selectedCategory);

  const toggleDetails = (index: number) => {
    setDetailsVisible(detailsVisible === index ? null : index); // Toggle visibility
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 flex">
        {/* Sidebar */}
        <aside className="w-1/4 pr-4">
          <h2 className="text-2xl font-semibold mb-4 text-[#6930c3] dark:text-[#b185db]">Categories</h2>
          <ul>
            {categories.map(category => (
              <li key={category} className="mb-2">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg shadow-md ${selectedCategory === category ? 'bg-gray-600 text-white' : 'bg-transparent dark:bg-gray-800 text-gray-700 dark:text-gray-300'} 
                  hover:bg-gray-600 hover:dark:bg-gray-700 hover:text-white transition-all duration-300`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Container */}
        <section className="w-3/4 ml-2">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-extrabold mb-6 text-center text-[#6930c3] dark:text-[#b185db]">My Applications</h1>
          
          {/* Cards Container */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOpportunities.map((opportunity, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-blue-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    {opportunity.status === "Applied" && <Briefcase className="w-6 h-6 text-blue-500 mr-2" />}
                    {opportunity.status === "Interview Scheduled" && <Calendar className="w-6 h-6 text-yellow-500 mr-2" />}
                    {opportunity.status === "Accepted" && <CheckCircle className="w-6 h-6 text-green-500 mr-2" />}
                    {opportunity.status === "Not Accepted" && <XCircle className="w-6 h-6 text-red-500 mr-2" />}
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{opportunity.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{opportunity.status}</p>
                  <button 
                    onClick={() => toggleDetails(index)} 
                    className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                  >
                    {detailsVisible === index ? 'Hide Details' : 'View Details'}
                  </button>
                  {detailsVisible === index && ( // Show details if this opportunity is selected
                    <div className="mt-4 p-4 border-t border-gray-300">
                      <p className="text-gray-700 dark:text-gray-300">Company: {opportunity.company}</p>
                      <p className="text-gray-700 dark:text-gray-300">Date: {opportunity.date}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyApplications;