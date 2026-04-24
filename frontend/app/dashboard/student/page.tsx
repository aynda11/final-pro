"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import dynamic from 'next/dynamic';
import {
  MapPin, Globe2, DollarSign, Briefcase, Ruler, Target,
  CheckCircle2, Building2, GraduationCap, ListFilter, Map as MapIcon,
  LayoutList, BookmarkPlus, ExternalLink, ArrowUpRight,
  Navigation as NavigationIcon, Filter,
  List, Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOpportunities, getProfile, Opportunity } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('./components/MapView'), { ssr: false });

// Helper type for mapped opportunities
interface UIOpportunity {
  id: string;
  position: string;
  company: string | {
    name: string;
    _id: string;
    logo?: string;
    industry?: string;
    location?: string;
  };
  location: string;
  coordinates: { lat: number; lng: number } | null;
  salary: string;
  type: string;
  distance?: number;
  skills: string[];
  isRemote?: boolean;
  description?: string;
}

export default function StudentDashboard() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'nearby' | 'remote'>('all');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city: string }>({
    lat: 36.1901,
    lng: 44.0091,
    city: "Erbil"
  });
  const [opportunities, setOpportunities] = useState<UIOpportunity[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const kurdistanCities = [
    { name: "Erbil", lat: 36.1901, lng: 44.0091 },
    { name: "Sulaymaniyah", lat: 35.5556, lng: 45.4351 },
    { name: "Duhok", lat: 36.8669, lng: 42.9503 },
    { name: "Halabja", lat: 35.1787, lng: 45.9864 },
    { name: "Zakho", lat: 37.1445, lng: 42.6872 }
  ];

  const availableSkills = [
    "React", "JavaScript", "TypeScript", "Node.js", "SQL",
    "Python", "Java", "C++", "AWS", "Docker",
    "MongoDB", "PostgreSQL", "GraphQL", "Vue.js", "Angular"
  ];

  const [currentOpportunityIndex, setCurrentOpportunityIndex] = useState(0);
  const [currentSkillOpportunityIndex, setCurrentSkillOpportunityIndex] = useState(0);
  const [userExperience, setUserExperience] = useState<any[]>([]);
  const [editingExperience, setEditingExperience] = useState<any[]>([]);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<UIOpportunity | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setUserSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    // Filter by skills if any are selected
    if (userSkills.length > 0) {
      if (opp.skills && Array.isArray(opp.skills)) {
        return opp.skills.some((skill: string) => userSkills.includes(skill));
      }
      return false;
    }

    // Filter by distance
    if (distanceFilter === 'remote') {
      return opp.type?.toLowerCase().includes('remote');
    }

    if (distanceFilter === 'nearby' && opp.coordinates && userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        opp.coordinates.lat,
        opp.coordinates.lng
      );
      return distance <= 50; // Show opportunities within 50km
    }

    return true;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const profile = await getProfile('student', token);
        setUserSkills(profile.skills || []);
        setUserExperience(profile.experience || []);
        if (profile.location) {
          const cityObj = kurdistanCities.find(c => c.name.toLowerCase() === profile.location.toLowerCase());
          if (cityObj) {
            setUserLocation({ lat: cityObj.lat, lng: cityObj.lng, city: cityObj.name });
          } else {
            setUserLocation(prev => ({ ...prev, city: profile.location }));
          }
        }
        setProfileLoaded(true);
        const fetchedOpportunities = await getOpportunities({ status: 'active' }, token);
        setOpportunities(
          fetchedOpportunities.map((opp: any) => ({
            ...opp,
            id: opp._id,
            position: opp.title,
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
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Load saved opportunities from localStorage
    const savedData = JSON.parse(localStorage.getItem('savedOpportunities') || '{"ids":[],"metadata":[]}');
    setSavedOpportunities(savedData.ids || []);
  }, []);

  const toggleSaveOpportunity = (opportunityId: string) => {
    setSavedOpportunities(prev => {
      const newSaved = prev.includes(opportunityId)
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId];
      
      // Save to localStorage with additional metadata
      const savedOpportunitiesData = {
        ids: newSaved,
        metadata: opportunities
          .filter(opp => newSaved.includes(opp.id))
          .map(opp => ({
            id: opp.id,
            location: opp.location,
            isLocationBased: locationBasedOpportunities.some(locOpp => locOpp.id === opp.id)
          }))
      };
      
      localStorage.setItem('savedOpportunities', JSON.stringify(savedOpportunitiesData));
      return newSaved;
    });
  };

  const isOpportunitySaved = (opportunityId: string) => {
    return savedOpportunities.includes(opportunityId);
  };

  const router = useRouter();

  const allOpportunities = opportunities;
  const experienceBasedOpportunities = opportunities.filter(opp => {
    // Return false if no experience or if experience array is empty
    if (!userExperience || !userExperience.length) return false;

    return userExperience.some(exp => {
      // Skip if experience entry is deleted or invalid
      if (!exp || !exp.position) return false;

      // Get experience details with proper null checks and type handling
      const expTitle = String(exp.position || '').toLowerCase().trim();
      const expCompany = String(exp.company || '').toLowerCase().trim();
      const expDescription = Array.isArray(exp.description) 
        ? exp.description.map((d: string) => String(d || '').toLowerCase().trim()).join(' ')
        : String(exp.description || '').toLowerCase().trim();
      const expSkills = Array.isArray(exp.skills) 
        ? exp.skills.map((s: string) => String(s).toLowerCase().trim())
        : [];

      // Get opportunity details with proper null checks
      const oppTitle = String(opp.position || '').toLowerCase().trim();
      const oppCompany = String(typeof opp.company === 'string' ? opp.company : opp.company?.name || '').toLowerCase().trim();
      const oppDescription = String(opp.description || '').toLowerCase().trim();
      const oppSkills = Array.isArray(opp.skills) 
        ? opp.skills.map((s: string) => String(s).toLowerCase().trim())
        : [];

      // Skip if no valid titles
      if (!expTitle || !oppTitle) return false;

      // Define role-specific keywords
      const roleKeywords = {
        backend: ['backend', 'back-end', 'server', 'api', 'database', 'node', 'express', 'django', 'spring', 'laravel'],
        hr: ['hr', 'human resources', 'recruiter', 'talent', 'personnel', 'recruitment', 'hiring', 'staffing']
      };

      // Check if experience matches any specific role
      const isBackendExp = roleKeywords.backend.some(keyword => expTitle.includes(keyword));
      const isHRExp = roleKeywords.hr.some(keyword => expTitle.includes(keyword));

      // Check if opportunity matches any specific role
      const isBackendOpp = roleKeywords.backend.some(keyword => 
        oppTitle.includes(keyword) || oppDescription.includes(keyword)
      );
      const isHROpp = roleKeywords.hr.some(keyword => 
        oppTitle.includes(keyword) || oppDescription.includes(keyword)
      );

      // Direct role match
      if ((isBackendExp && isBackendOpp) || (isHRExp && isHROpp)) {
        return true;
      }

      // Split titles into meaningful words (3+ characters)
      const expWords = expTitle.split(/\s+/).filter((word: string) => word.length > 2);
      const oppWords = oppTitle.split(/\s+/).filter((word: string) => word.length > 2);

      // Check for title match
      const titleMatch = expWords.some((word: string) => oppWords.includes(word)) || 
                        oppWords.some((word: string) => expWords.includes(word));

      // Check for company match
      const companyMatch = expCompany && oppCompany && 
                          (expCompany.includes(oppCompany) || oppCompany.includes(expCompany));

      // Check for skills match
      const skillsMatch = expSkills.length > 0 && oppSkills.length > 0 &&
                         expSkills.some((skill: string) => oppSkills.includes(skill));

      // Check for description match
      const descriptionMatch = expDescription && oppDescription &&
                             (expDescription.includes(oppTitle) || oppDescription.includes(expTitle));

      // Return true if any of the matches are found
      return titleMatch || companyMatch || skillsMatch || descriptionMatch;
    });
  });

  const locationBasedOpportunities = opportunities.filter(opp =>
    userLocation.city && opp.location?.toLowerCase().includes(userLocation.city.toLowerCase())
  );

  // Add handlers for prev/next opportunity and skill opportunity
  const prevOpportunity = () => {
    setCurrentOpportunityIndex((prev) => Math.max(prev - 1, 0));
  };
  const nextOpportunity = () => {
    setCurrentOpportunityIndex((prev) =>
      prev < allOpportunities.length - 3 ? prev + 1 : prev
    );
  };
  const prevSkillOpportunity = () => {
    setCurrentSkillOpportunityIndex((prev) => Math.max(prev - 1, 0));
  };
  const nextSkillOpportunity = () => {
    setCurrentSkillOpportunityIndex((prev) =>
      prev < experienceBasedOpportunities.length - 3 ? prev + 1 : prev
    );
  };
  const handleViewLocation = (coordinates: { lat: number; lng: number }) => {
    setSelectedLocation(coordinates);
    setViewMode('map');
  };

  // Handler to save experience changes
  const handleSaveExperience = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update your experience.",
          variant: "destructive"
        });
        return;
      }

      // Update profile with new experience data
      const response = await fetch('/api/profile/student', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          experience: editingExperience
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update experience');
      }

      // Update local state
      setUserExperience([...editingExperience]);
      setIsEditingExperience(false);

      toast({
        title: "Success",
        description: "Your experience has been updated successfully.",
      });

      // Refresh profile data
      const updatedProfile = await getProfile('student', token);
      setUserExperience(updatedProfile.experience || []);
    } catch (error) {
      console.error('Error updating experience:', error);
      toast({
        title: "Error",
        description: "Failed to update experience. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler to add a new experience entry
  const handleAddExperience = () => {
    setEditingExperience(prev => [...prev, { 
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  // Handler to update an experience entry
  const handleChangeExperience = (idx: number, field: string, value: string) => {
    setEditingExperience(prev => prev.map((exp, i) => 
      i === idx ? { ...exp, [field]: value } : exp
    ));
  };

  // Handler to remove an experience entry
  const handleRemoveExperience = (idx: number) => {
    setEditingExperience(prev => prev.filter((_, i) => i !== idx));
  };

  // Handler to edit experience
  const handleEditExperience = () => {
    setEditingExperience([...userExperience]);
    setIsEditingExperience(true);
  };

  const handleMarkerClick = (opportunity: UIOpportunity) => {
    setSelectedOpportunity(opportunity);
    if (opportunity.coordinates) {
      setSelectedLocation(opportunity.coordinates);
    }
  };

  const handleMapView = async () => {
    try {
      setMapLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view opportunities.",
          variant: "destructive"
        });
        return;
      }

      const fetchedOpportunities = await getOpportunities({ status: 'active' }, token);
      const mappedOpportunities = fetchedOpportunities.map((opp: any) => ({
        id: opp._id,
        position: opp.title,
        company: {
          name: opp.company?.name || 'Company not specified',
          _id: opp.company?._id || '',
          logo: opp.company?.logo || '',
          industry: opp.company?.industry || '',
          location: opp.company?.location || ''
        },
        location: opp.location,
        coordinates: (() => {
          const city = kurdistanCities.find(c => opp.location?.toLowerCase().includes(c.name.toLowerCase()));
          return city ? { lat: city.lat, lng: city.lng } : null;
        })(),
        salary: opp.salary?.min && opp.salary?.max ? `$${opp.salary.min} - $${opp.salary.max}` : 'N/A',
        type: opp.opportunityType,
        skills: opp.tags || [],
        isRemote: opp.type?.toLowerCase().includes('remote') || false,
        description: opp.description || ''
      }));

      setOpportunities(mappedOpportunities);
      setViewMode('map');
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMapLoading(false);
    }
  };

  const handleApply = async (opportunityId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to apply for opportunities.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ opportunityId })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast({
        title: "Success",
        description: "Your application has been submitted successfully.",
      });

      // Refresh opportunities to update application status
      handleMapView();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* Filters Skeleton */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          {/* Opportunities Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          {/* Skills Based Recommendations Skeleton */}
          <div className="mt-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOpportunityCard = (opportunity: UIOpportunity) => (
    <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-[#9d4edd] dark:text-white">
            {opportunity.position}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {typeof opportunity.company === 'string' 
              ? opportunity.company 
              : opportunity.company?.name || 'Company not specified'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => toggleSaveOpportunity(opportunity.id)}
          className={`flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg ${
            isOpportunitySaved(opportunity.id) ? 'bg-[#5e60ce] text-white' : ''
          }`}
        >
          <BookmarkPlus className="w-4 h-4" /> 
          {isOpportunitySaved(opportunity.id) ? 'Saved' : 'Save'}
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
  );

  // Update the location-based opportunities section to use the new render function
  const renderLocationBasedOpportunity = (opportunity: UIOpportunity) => (
    <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-[#9d4edd] dark:text-white">
            {opportunity.position}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {typeof opportunity.company === 'string' 
              ? opportunity.company 
              : opportunity.company?.name || 'Company not specified'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => toggleSaveOpportunity(opportunity.id)}
          className={`flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg ${
            isOpportunitySaved(opportunity.id) ? 'bg-[#5e60ce] text-white' : ''
          }`}
        >
          <BookmarkPlus className="w-4 h-4" /> 
          {isOpportunitySaved(opportunity.id) ? 'Saved' : 'Save'}
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
  );

  // Update the experience-based opportunities section
  const renderExperienceBasedOpportunity = (opportunity: UIOpportunity) => (
    <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-[#9d4edd] dark:text-white">
            {opportunity.position}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {typeof opportunity.company === 'string' 
              ? opportunity.company 
              : opportunity.company?.name || 'Company not specified'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => toggleSaveOpportunity(opportunity.id)}
          className={`flex items-center gap-1 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg ${
            savedOpportunities.includes(opportunity.id) ? 'bg-[#5e60ce] text-white' : ''
          }`}
        >
          <BookmarkPlus className="w-4 h-4" /> 
          {savedOpportunities.includes(opportunity.id) ? 'Saved' : 'Save'}
        </Button>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Globe2 className="w-4 h-4" />
          <span>Remote Position (Company Headquarters: {opportunity.location.replace('Remote (HQ: ', '').replace(')', '')})</span>
        </div>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4" /> <span>{opportunity.salary}</span>
          <span>•</span>
          <Briefcase className="w-4 h-4" /> <span>{opportunity.type}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {opportunity.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
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
  );

  // Update the selected opportunity details section
  const renderSelectedOpportunityDetails = (opportunity: UIOpportunity) => (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{opportunity.position}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-300">
            <Building2 className="w-4 h-4 inline mr-2" />
            {typeof opportunity.company === 'string' 
              ? opportunity.company 
              : opportunity.company?.name || 'Company not specified'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 inline mr-2" />
            {opportunity.location}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4 inline mr-2" />
            {opportunity.salary}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-300">
            <Briefcase className="w-4 h-4 inline mr-2" />
            {opportunity.type}
          </p>
          {opportunity.skills && opportunity.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Required Skills:</p>
              <div className="flex flex-wrap gap-1">
                {opportunity.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Link href={`/dashboard/student/apply/${opportunity.id}`}>
          <Button className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" /> Apply Now
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#6930c3] dark:text-[#b185db]">
              {viewMode === 'list' ? 'All Opportunities' : 'Opportunities Near You'}
            </h2>
            <div className="flex gap-2 items-center">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
              >
                <LayoutList className="w-4 h-4" /> List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={handleMapView}
                disabled={mapLoading}
                className="flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
              >
                {mapLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapIcon className="w-4 h-4" />
                )}
                Map View
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <>
              {/* List View Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allOpportunities.slice(0, 3).map(renderOpportunityCard)}
              </div>

              <div className="flex justify-end mt-6 mb-8">
                <Link href="/dashboard/student/all-opportunities">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
                  >
                    View More
                  </Button>
                </Link>
              </div>

              {/* Skills Based Recommendations */}
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-[#6930c3] dark:text-[#b185db]">
                    Based on Your Experience
                  </h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
                  <div className="flex flex-wrap gap-2">
                    {userExperience.map((exp) => (
                      <span key={exp.position} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {exp.position}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experienceBasedOpportunities.slice(0, 3).map(renderExperienceBasedOpportunity)}
                </div>
                <div className="flex justify-end mt-6 mb-8">
                  <Link href="/dashboard/student/experience-opportunities">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
                    >
                      View More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Location Based Recommendations */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6 text-[#6930c3] dark:text-[#b185db]">
                  Recommended Opportunities Near You
                </h2>
                <div className="rounded-lg shadow mb-6 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Showing opportunities near {userLocation.city}, Kurdistan
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {locationBasedOpportunities.slice(0, 3).map(renderLocationBasedOpportunity)}
                  </div>
                </div>
                <div className="flex justify-end mt-6 mb-8">
                  <Link href="/dashboard/student/location-opportunities">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border border-[#5e60ce] bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-lg"
                    >
                      View More
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            // Map View Content
            <div className="h-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
              <MapView
                opportunities={filteredOpportunities}
                selectedLocation={selectedLocation}
                onMarkerClick={handleMarkerClick}
                onSaveOpportunity={toggleSaveOpportunity}
                savedOpportunities={savedOpportunities}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}