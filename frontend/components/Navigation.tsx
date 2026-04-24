"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Filter, User, UserCircle2, FileText, Bookmark, Settings, LightbulbIcon, Power, Sun, Moon, Bell, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

const Navigation = () => {
  const pathname = usePathname() || "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  
  // Navigation states
  const isLoggedIn = pathname.includes('/dashboard');
  const isStudent = pathname.includes('/student');
  const isCompany = pathname.includes('/company');
  const isProfilePage = pathname.includes('/profile');
  const isMyApplicationsPage = pathname.includes('/my-applications');
  const isSavedOpportunitiesPage = pathname.includes('/saved-opportunities');
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Refs
  const notificationsRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Search and filter states
  const [navSearch, setNavSearch] = useState(searchParams?.get('search') || '');
  const [locationSearch, setLocationSearch] = useState(searchParams?.get('location') || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams?.get('opportunityType')?.split(',').filter(Boolean) || []
  );
  const [minSalary, setMinSalary] = useState(searchParams?.get('minSalary') || '');
  const [maxSalary, setMaxSalary] = useState(searchParams?.get('maxSalary') || '');

  const opportunityTypes = [
    "Internship",
    "Externship",
    "Freelance",
    "Part-time",
    "Full-time",
    "Remote",
    "Contract",
    "Research",
    "Apprenticeship"
  ];

  // Update search states when URL params change
  useEffect(() => {
    setNavSearch(searchParams?.get('search') || '');
    setLocationSearch(searchParams?.get('location') || '');
    setSelectedTypes(
      searchParams?.get('opportunityType')?.split(',').filter(Boolean) || []
    );
    setMinSalary(searchParams?.get('minSalary') || '');
    setMaxSalary(searchParams?.get('maxSalary') || '');
  }, [searchParams]);

  const handleSalaryChange = (type: 'min' | 'max', value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (type === 'min') {
      setMinSalary(numericValue);
      // If min is greater than max, update max
      if (maxSalary && Number(numericValue) > Number(maxSalary)) {
        setMaxSalary(numericValue);
      }
    } else {
      // Don't allow max to be less than min
      if (minSalary && Number(numericValue) < Number(minSalary)) {
        setMaxSalary(minSalary);
      } else {
        setMaxSalary(numericValue);
      }
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Add title search
    if (navSearch) {
      params.append('search', navSearch);
    }
    
    // Add location search
    if (locationSearch) {
      params.append('location', locationSearch.trim());
    }
    
    // Add opportunity types
    if (selectedTypes.length > 0) {
      params.append('opportunityType', selectedTypes.join(','));
    }
    
    // Add salary range - only add if values are valid numbers
    if (minSalary && !isNaN(Number(minSalary))) {
      params.append('minSalary', minSalary);
    }
    if (maxSalary && !isNaN(Number(maxSalary))) {
      params.append('maxSalary', maxSalary);
    }

    // Navigate to search results
    router.push(`/dashboard/student/all-opportunities?${params.toString()}`);
    setShowFilters(false); // Close filters after search
  };

  const toggleType = (type: string) => {
    const typeValue = type.toLowerCase();
    setSelectedTypes(prev => 
      prev.includes(typeValue)
        ? prev.filter(t => t !== typeValue)
        : [...prev, typeValue]
    );
  };

  // Check if we're on the main dashboard page
  const isMainDashboard = pathname === '/dashboard/student' || pathname === '/dashboard/company';
  
  // Determine the home link based on login status and user type
  const getHomeLink = () => {
    if (!isLoggedIn) return '/';
    return pathname.includes('/student') ? '/dashboard/student' : '/dashboard/company';
  };

  const handleSignOut = () => {
    setShowProfileMenu(false);
    router.push('/');
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens, etc.)
    // Redirect to home page after logout
    router.push('/');
  };

  // Theme toggle button component
  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 bg-white/90 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600 dark:text-gray-300" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-600 dark:text-gray-300" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  useEffect(() => {
    // Simulate fetching notifications
    const fetchedNotifications = [
      "New internship posted!",
      "Your application was accepted.",
      "Your interview is scheduled."
    ];
    
    // Set notifications excluding "New message"
    setNotifications(fetchedNotifications.filter(notification => notification !== "New message"));
  }, []);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(prev => !prev);
  };

  const handleNotificationsToggle = () => {
    setShowNotifications(prev => !prev);
  };

  return (
    <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${isProfilePage ? 'profile-nav' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col py-4">
          {/* Top Bar with Logo and Account */}
          <div className="flex items-center justify-between mb-4">
            <Link 
              href={getHomeLink()} 
              className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-400 dark:hover:from-blue-200 dark:hover:to-purple-300 transition-colors duration-300"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.05em'
              }}
            >
              Career<span className="font-black">Hub</span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isLoggedIn ? (
                <>
                  {isCompany && (
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center rounded-full p-2 bg-white/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>
                  )}
                  {isStudent && (
                    <>
                      <div className="relative">
                        <Button 
                          onClick={handleNotificationsToggle} 
                          className="relative rounded-full p-2 bg-white/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                          ref={notificationsRef}
                        >
                          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </Button>
                        
                        {showNotifications && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10" ref={dropdownRef}>
                            <div className="py-2">
                              {notifications
                                .filter(notification => notification !== "New message")
                                .map((notification, index) => (
                                  <div key={`notification-${index}-${notification}`} className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    {notification}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button onClick={handleDropdownToggle} className="flex items-center rounded-full p-2 bg-white/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                        {showDropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10" ref={dropdownRef}>
                            <div className="py-2">
                              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Profile</Link>
                              <Link href="/my-applications" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">My Applications</Link>
                              <Link href="/saved-opportunities" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Saved Opportunities</Link>
                              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Logout</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-4">
                  {!isProfilePage && !isMyApplicationsPage && !isSavedOpportunitiesPage && (
                    <>
                      <Link href="/login">
                        <Button 
                          variant="ghost" 
                          className="px-6 py-2 text-sm font-medium bg-white/90 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button 
                          className="px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-300 dark:to-purple-400 text-white dark:text-gray-900 hover:from-blue-400 hover:to-purple-400 dark:hover:from-blue-200 dark:hover:to-purple-300 transition-all duration-300 border-none"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {isLoggedIn && pathname.includes('/student') && (
            <div className="space-y-4">
              {/* Search Bar with Filter Toggle */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Search className="text-gray-400 w-5 h-5" />
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  <input
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    type="text"
                    placeholder="Search for internships, companies, or skills..."
                    className="w-full pl-20 pr-4 py-3 rounded-full bg-white/90 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-300/20 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleSearch}
                      className="rounded-full w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(!showFilters)}
                      className="rounded-full w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Filter
                        className={`w-4 h-4 ${
                          showFilters
                            ? 'text-[#9d4edd] dark:text-purple-400'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                  {/* Location Filter */}
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Location</h3>
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      placeholder="Enter city name (e.g., Erbil, Sulaymaniyah)"
                      className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                    />
                  </div>

                  {/* Salary Range Filter */}
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Salary Range (USD)</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Minimum</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="text"
                            value={minSalary}
                            onChange={(e) => handleSalaryChange('min', e.target.value)}
                            placeholder="Min"
                            className="w-full pl-7 pr-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Maximum</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="text"
                            value={maxSalary}
                            onChange={(e) => handleSalaryChange('max', e.target.value)}
                            placeholder="Max"
                            className="w-full pl-7 pr-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {minSalary && maxSalary ? (
                        `Showing opportunities with salary range $${Number(minSalary).toLocaleString()} - $${Number(maxSalary).toLocaleString()}`
                      ) : minSalary ? (
                        `Showing opportunities with minimum salary $${Number(minSalary).toLocaleString()}`
                      ) : maxSalary ? (
                        `Showing opportunities with maximum salary $${Number(maxSalary).toLocaleString()}`
                      ) : (
                        'Enter salary range to filter opportunities'
                      )}
                    </p>
                  </div>

                  {/* Opportunity Type Filter */}
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Opportunity Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {opportunityTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedTypes.includes(type.toLowerCase())
                              ? 'bg-[#9d4edd]/20 dark:bg-purple-400/20 border border-[#9d4edd] dark:border-purple-400 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                          } hover:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors duration-200`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSearch}
                      className="border border-gray-700 dark:border-gray-600 bg-gray-800/50 dark:bg-gray-700/50 hover:bg-[#9d4edd]/20 dark:hover:bg-purple-400/20 text-white px-6 py-2 rounded-full transition-colors duration-200"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      

      {/* Overlay to close profile menu when clicking outside */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navigation; 
