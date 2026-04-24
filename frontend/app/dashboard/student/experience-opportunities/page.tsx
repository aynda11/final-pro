"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { getOpportunities, getProfile, Opportunity } from "@/lib/api";
import { MapPin, DollarSign, Briefcase, ArrowUpRight, ExternalLink, BookmarkPlus, NavigationIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UIOpportunity {
  id: string;
  position: string;
  type: string;
  skills: string[];
  coordinates: { lat: number; lng: number } | null;
  salary: string;
  location: string;
  description: string;
  company?: any;
  requirements?: string[];
}

export default function ExperienceOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<UIOpportunity[]>([]);
  const [userExperience, setUserExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const kurdistanCities = [
    { name: "Erbil", lat: 36.1901, lng: 44.0091 },
    { name: "Sulaymaniyah", lat: 35.5556, lng: 45.4351 },
    { name: "Duhok", lat: 36.8669, lng: 42.9503 },
    { name: "Halabja", lat: 35.1787, lng: 45.9864 },
    { name: "Zakho", lat: 37.1445, lng: 42.6872 }
  ];
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const profile = await getProfile('student', token);
        setUserExperience(profile.experience || []);
        const fetchedOpportunities = await getOpportunities({ status: 'active' }, token);
        // Filter by experience-based logic (by position/title)
        const experienceBased = fetchedOpportunities.filter((opp: any) => {
          if (!profile.experience || !profile.experience.length) return false;
          return profile.experience.some((exp: any) => {
            const expTitle = (exp.position || '').toLowerCase().trim();
            const oppTitle = (typeof opp.title === 'object' ? opp.title.name : opp.title || '').toLowerCase().trim();
            if (!expTitle || !oppTitle) return false;
            const rawWords = expTitle.split(/\s+/);
            const expWords: string[] = rawWords.filter((word: string) => word.length > 2);
            return expWords.some(word => oppTitle.includes(word));
          });
        });
        setOpportunities(
          experienceBased.map((opp: any) => ({
            ...opp,
            id: opp._id,
            position: typeof opp.title === 'object' ? opp.title.name : opp.title,
            type: opp.opportunityType,
            location: opp.location,
            salary: opp.salary?.min && opp.salary?.max ? `$${opp.salary.min} - $${opp.salary.max}` : 'N/A',
            skills: opp.tags || [],
            coordinates: (() => {
              const city = kurdistanCities.find(c => opp.location?.toLowerCase().includes(c.name.toLowerCase()));
              return city ? { lat: city.lat, lng: city.lng } : null;
            })(),
          }))
        );
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#6930c3] dark:text-[#b185db]">Opportunities Based on Your Experience</h2>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
          >
            <ArrowUpRight className="w-4 h-4 rotate-180" /> Back to Dashboard
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 dark:text-gray-300">No opportunities found.</div>
          )}
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-[#9d4edd] dark:text-white">{opportunity.position}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{typeof opportunity.company === 'string' ? opportunity.company : opportunity.company?.name || ''}</p>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg">
                  <BookmarkPlus className="w-4 h-4" /> Save
                </Button>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" /> <span>{opportunity.location}</span>
                </div>
                <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" /> <span>{opportunity.salary}</span>
                  <span>•</span>
                  <Briefcase className="w-4 h-4" /> <span>{opportunity.type}</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{opportunity.description}</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/dashboard/student/apply/${opportunity.id}`}>
                  <Button size="sm" className="flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg">
                    <ArrowUpRight className="w-4 h-4" /> Apply Now
                  </Button>
                </Link>
                <Link href={`/dashboard/student/opportunity/${opportunity.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg">
                    <ExternalLink className="w-4 h-4" /> Learn More
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!opportunity.coordinates}
                  onClick={() => {/* TODO: Show map modal for this opportunity */}}
                  className="flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
                >
                  <NavigationIcon className="w-4 h-4" /> View Location
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 