"use client";

import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Briefcase, ArrowUpRight, CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { getOpportunities } from "@/lib/api";

interface SavedOpportunity {
  id: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  skills: string[];
  isLocationBased: boolean;
}

interface UserLocation {
  lat: number;
  lng: number;
  city: string;
}

const SavedOpportunities = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Saved');
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userExperience, setUserExperience] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 36.1901,
    lng: 44.0091,
    city: "Erbil"
  });

  const kurdistanCities = [
    { name: "Erbil", lat: 36.1901, lng: 44.0091 },
    { name: "Sulaymaniyah", lat: 35.5556, lng: 45.4351 },
    { name: "Duhok", lat: 36.8669, lng: 42.9503 },
    { name: "Halabja", lat: 35.1787, lng: 45.9864 },
    { name: "Zakho", lat: 37.1445, lng: 42.6872 }
  ];

  useEffect(() => {
    const loadSavedOpportunities = async () => {
      try {
        const savedData = JSON.parse(localStorage.getItem('savedOpportunities') || '{"ids":[],"metadata":[]}');
        const userExp = JSON.parse(localStorage.getItem('userExperience') || '[]');
        const savedLocation = localStorage.getItem('userLocation');
        
        setUserExperience(userExp);
        
        if (savedLocation) {
          const locationData = JSON.parse(savedLocation);
          setUserLocation(locationData);
        }

        if (savedData.ids.length === 0) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const allOpportunities = await getOpportunities({ status: 'active' }, token);
        const saved = allOpportunities
          .filter((opp: any) => savedData.ids.includes(opp._id))
          .map((opp: any) => {
            const metadata = savedData.metadata.find((m: any) => m.id === opp._id);
            return {
              id: opp._id,
              position: opp.title,
              company: typeof opp.company === 'string' ? opp.company : opp.company?.name,
              location: opp.location,
              salary: opp.salary?.min && opp.salary?.max ? `$${opp.salary.min} - $${opp.salary.max}` : 'N/A',
              type: opp.opportunityType,
              description: opp.description,
              skills: opp.tags || [],
              isLocationBased: metadata?.isLocationBased || false
            };
          });

        setSavedOpportunities(saved);
      } catch (error) {
        console.error('Error loading saved opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedOpportunities();
  }, []);

  const filterOpportunities = () => {
    switch (selectedCategory) {
      case 'Based on Your Experience':
        return savedOpportunities.filter(opp => {
          if (!userExperience.length) return false;

          return userExperience.some(exp => {
            const expTitle = (exp.position || '').toLowerCase().trim();
            const oppTitle = (opp.position || '').toLowerCase().trim();

            if (!expTitle || !oppTitle) return false;

            const rawWords = expTitle.split(/\s+/);
            const expWords: string[] = rawWords.filter((word: string) => word.length > 2);

            return expWords.some(word => oppTitle.includes(word));
          });
        });
      case 'Near Your Location':
        return savedOpportunities.filter(opp => {
          // Check if the opportunity was saved from the location-based section
          if (opp.isLocationBased) return true;
          
          // Check if the opportunity location matches the user's city
          return userLocation.city && 
            opp.location?.toLowerCase().includes(userLocation.city.toLowerCase());
        });
      default:
        return savedOpportunities;
    }
  };

  const removeSavedOpportunity = (opportunityId: string) => {
    const savedData = JSON.parse(localStorage.getItem('savedOpportunities') || '{"ids":[],"metadata":[]}');
    const newIds = savedData.ids.filter((id: string) => id !== opportunityId);
    const newMetadata = savedData.metadata.filter((m: any) => m.id !== opportunityId);
    
    const newSavedData = {
      ids: newIds,
      metadata: newMetadata
    };
    
    localStorage.setItem('savedOpportunities', JSON.stringify(newSavedData));
    setSavedOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
  };

  // Update the isLocationBasedOpportunity function
  const isLocationBasedOpportunity = (opportunity: SavedOpportunity) => {
    return opportunity.isLocationBased || (
      userLocation.city && 
      opportunity.location?.toLowerCase().includes(userLocation.city.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 flex">
        {/* Sidebar for Categories */}
        <aside className="w-1/4 pr-4">
          <h2 className="text-2xl font-semibold mb-4 text-[#6930c3] dark:text-[#b185db]">Categories</h2>
          <ul>
            <li className="mb-2">
              <button onClick={() => setSelectedCategory('All Saved')} className={`w-full text-left px-4 py-3 rounded-lg transform transition-transform duration-300 ${selectedCategory === 'All Saved' ? 'bg-gray-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-gray-400 hover:text-black hover:scale-105`}>
                All Saved
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => setSelectedCategory('Based on Your Experience')} className={`w-full text-left px-4 py-3 rounded-lg transform transition-transform duration-300 ${selectedCategory === 'Based on Your Experience' ? 'bg-gray-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-gray-400 hover:text-black hover:scale-105`}>
                Based on Your Experience
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => setSelectedCategory('Near Your Location')} className={`w-full text-left px-4 py-3 rounded-lg transform transition-transform duration-300 ${selectedCategory === 'Near Your Location' ? 'bg-gray-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-gray-400 hover:text-black hover:scale-105`}>
                Near Your Location
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content Container */}
        <section className="w-3/4 ml-2">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-4 transition-colors duration-300"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-extrabold mb-6 text-center text-[#6930c3] dark:text-[#b185db]">Saved Opportunities</h1>
          
          {/* Display Filtered Opportunities */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {loading ? (
              <p className="text-gray-700 dark:text-gray-300">Loading saved opportunities...</p>
            ) : filterOpportunities().length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {selectedCategory === 'Based on Your Experience' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#6930c3] dark:text-[#b185db]">Your Experience</h3>
                    <div className="flex flex-wrap gap-2">
                      {userExperience.map((exp, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {exp.position}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCategory === 'Near Your Location' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#6930c3] dark:text-[#b185db]">Your Location</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Showing opportunities near {userLocation.city}, Kurdistan
                      </span>
                    </div>
                  </div>
                )}
                {filterOpportunities().map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{opportunity.position}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{opportunity.company}</p>
                      </div>
                      <div className="flex gap-2">
                        {isLocationBasedOpportunity(opportunity) && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Near You
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSavedOpportunity(opportunity.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" /> <span>{opportunity.location}</span>
                      </div>
                      <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" /> <span>{opportunity.salary}</span>
                        <span>•</span>
                        <Briefcase className="w-4 h-4" /> <span>{opportunity.type}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {opportunity.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/student/apply/${opportunity.id}`}>
                        <Button
                          size="sm"
                          className="flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
                        >
                          <ArrowUpRight className="w-4 h-4" /> Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No saved opportunities found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SavedOpportunities;