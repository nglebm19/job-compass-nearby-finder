import { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Car, Bus, Building2, Users, Star, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Cashier",
    company: "Thien Huong Sandwiches",
    location: "San Jose, California",
    distance: "Within 15 miles",
    salary: "$17/hour",
    postedTime: "1 hour ago",
    type: "Part-time",
    description: "We are looking for a friendly and reliable cashier to join our team. Handle customer transactions, maintain clean workspace, and provide excellent customer service.",
    qualifications: ["High school diploma", "Customer service experience preferred", "Basic math skills", "Bilingual (English/Vietnamese) a plus"],
    contact: "Maria Nguyen - Store Manager",
    images: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
    commute: {
      car: { time: "12-15 minutes", cost: "$2.50 in fuel", insights: "Light traffic most hours" },
      transit: { time: "25 minutes", route: "Bus #22 to downtown, 5-minute walk", insights: "Reliable schedule" }
    }
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Primera",
    location: "San Francisco Bay Area",
    distance: "Within 25 miles",
    salary: "$120k - $160k/year",
    postedTime: "4 hours ago",
    type: "Full-time",
    description: "Join our early-stage AI startup building foundational infrastructure for commercial real estate. Work with cutting-edge technology in document abstraction and portfolio analysis.",
    qualifications: ["Bachelor's in Computer Science", "3+ years React/TypeScript experience", "Python knowledge", "AI/ML experience preferred"],
    contact: "Sarah Chen - Engineering Manager",
    images: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
    commute: {
      car: { time: "35-50 minutes", cost: "$8.50 in fuel + parking", insights: "Heavy traffic during peak hours" },
      transit: { time: "55 minutes", route: "Caltrain to SF, then Muni", insights: "Consistent timing, work-friendly" }
    }
  },
  {
    id: 3,
    title: "Waiter/Waitress",
    company: "The Garden Restaurant",
    location: "Palo Alto, California",
    distance: "Within 20 miles",
    salary: "$16/hour + tips",
    postedTime: "2 hours ago",
    type: "Part-time",
    description: "Night shift position available Monday-Wednesday, 5pm-10pm. Seeking experienced server for upscale dining establishment.",
    qualifications: ["Restaurant experience required", "Excellent communication skills", "Flexible schedule", "Food safety certification preferred"],
    contact: "David Kim - Restaurant Manager",
    images: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
    commute: {
      car: { time: "18-25 minutes", cost: "$3.20 in fuel", insights: "Moderate evening traffic" },
      transit: { time: "40 minutes", route: "Bus #101 to University Ave", insights: "Limited evening service" }
    }
  }
];

const Index = () => {
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
  const [searchTerm, setSearchTerm] = useState("Software Engineer");
  const [showPostJob, setShowPostJob] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (!jobDescription.trim()) return;
    
    setIsLoading(true);
    
    try {
      // TODO: Replace this with IBM Granite 3.3 language model integration
      // For now, using placeholder logic to demonstrate functionality
      const segments = await parseJobDescription(jobDescription);
      
      setCompanyName(segments.companyName || "");
      setJobTitle(segments.jobTitle || "");
      setLocation(segments.location || "");
      setSalaryRange(segments.salaryRange || "");
      setContactInfo(segments.contactInfo || "");
    } catch (error) {
      console.error('Error parsing job description:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder function for job description parsing
  // TODO: Replace with IBM Granite 3.3 model implementation
  const parseJobDescription = async (description: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic pattern matching for demonstration
    // This should be replaced with IBM Granite 3.3 model
    const patterns = {
      companyName: /(?:at|for|with) ([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.)/i,
      jobTitle: /(?:looking for|seeking|hiring) (?:a |an )?([a-zA-Z\s/]+?)(?:\s|,|\.)/i,
      location: /(?:in|at|located) ([A-Z][a-zA-Z\s,]+?)(?:\s|,|\.)/i,
      salaryRange: /(\$[\d,]+-?\$?[\d,]*(?:\/hour|\/year|\/hr)?)/i,
      contactInfo: /(?:contact|reach out to) ([A-Z][a-zA-Z\s]+ - [A-Z][a-zA-Z\s]+)/i
    };

    const segments: any = {};
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = description.match(pattern);
      if (match) {
        segments[key] = match[1].trim();
      }
    });

    return segments;
  };

  const handlePostJob = () => {
    if (jobDescription.trim()) {
      console.log("Posting job:", {
        description: jobDescription,
        companyName,
        jobTitle,
        location,
        salaryRange,
        contactInfo
      });
      
      // Reset form
      setJobDescription("");
      setCompanyName("");
      setJobTitle("");
      setLocation("");
      setSalaryRange("");
      setContactInfo("");
      setShowPostJob(false);
    }
  };

  const handleJobBoardClick = () => {
    setShowPostJob(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <h1 
                className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleJobBoardClick}
              >
                JobBoard
              </h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowPostJob(!showPostJob)} className="bg-blue-600 hover:bg-blue-700">
              Post a Job
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth">
                Login/Signup
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Changes based on showPostJob */}
          <div className="lg:col-span-2 space-y-4">
            {showPostJob ? (
              /* Job Preview */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Job Preview</h2>
                      <p className="text-sm text-gray-600">This is how your job posting will appear</p>
                    </div>
                    <Button 
                      onClick={handleSync}
                      disabled={!jobDescription.trim() || isLoading}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {jobDescription || companyName || jobTitle ? (
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h3 className="font-semibold text-gray-900 mb-2">{jobTitle || "New Job Posting"}</h3>
                        <p className="text-sm text-blue-600 mb-2">{companyName || "Your Company"}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{location || "Location"} - Just posted</span>
                        </div>
                        {salaryRange && (
                          <div className="flex items-center text-sm text-green-700 font-medium mb-2">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span>{salaryRange}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-700 mt-3">{jobDescription}</p>
                        {contactInfo && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <strong>Contact:</strong> {contactInfo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Start typing your job description to see the preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Job Listings */
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Software Engineer in United States
                    </h2>
                    <Badge variant="secondary">{mockJobs.length} results</Badge>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">Date posted</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">Experience level</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">Salary</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">Remote</Badge>
                  </div>
                </div>

                {/* Job Listings */}
                <div className="space-y-3">
                  {mockJobs.map((job) => (
                    <Card 
                      key={job.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${selectedJob.id === job.id ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-sm text-blue-600 mb-1">{job.company}</p>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{job.location} - {job.distance}</span>
                            </div>
                            <div className="flex items-center text-sm text-green-700 font-medium">
                              <DollarSign className="w-3 h-3 mr-1" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {job.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Side - Changes based on showPostJob */}
          <div className="lg:col-span-3">
            {showPostJob ? (
              /* Post Job Form */
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Post a New Job</h2>
                  <p className="text-sm text-gray-600">Describe your job opening and we'll help you create a professional listing</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description
                    </label>
                    <Textarea
                      placeholder="Example: a waiter that works night shift from Monday - Wednesday, 5pm - 10pm"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="h-32 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Describe the role, schedule, requirements, and any other important details. Use the Sync button to auto-fill the fields below.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <Input 
                        placeholder="Your Company" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <Input 
                        placeholder="e.g. Waiter/Waitress" 
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input 
                        placeholder="City, State" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Range
                      </label>
                      <Input 
                        placeholder="e.g. $16/hour + tips" 
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information
                    </label>
                    <Input 
                      placeholder="Your name and title" 
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setShowPostJob(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePostJob} className="bg-blue-600 hover:bg-blue-700">
                      Post Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Job Details */
              <div className="space-y-6">
                {/* Job Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                        <p className="text-lg text-blue-600 mb-2">{selectedJob.company}</p>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{selectedJob.location} - {selectedJob.postedTime}</span>
                        </div>
                        <div className="flex items-center text-lg font-semibold text-green-700">
                          <DollarSign className="w-5 h-5 mr-1" />
                          <span>{selectedJob.salary}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {selectedJob.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Apply Now
                      </Button>
                      <Button variant="outline">
                        Save Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Who should I contact
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700">{selectedJob.contact}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/chat">
                          Contact
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* About the Job */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">About the job</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Qualifications</h4>
                      <ul className="space-y-2">
                        {selectedJob.qualifications.map((qual, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{qual}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Commute Analysis */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Commute Analysis</h3>
                    <p className="text-sm text-gray-600">Transportation options to {selectedJob.location}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* By Car */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Car className="w-5 h-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">By Car</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span><strong>Time:</strong> {selectedJob.commute.car.time}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                            <span><strong>Cost:</strong> {selectedJob.commute.car.cost}</span>
                          </div>
                          <p className="text-gray-600 mt-2">
                            <strong>Insights:</strong> {selectedJob.commute.car.insights}
                          </p>
                        </div>
                      </div>

                      {/* By Transit */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Bus className="w-5 h-5 mr-2 text-green-600" />
                          <h4 className="font-medium">By Public Transit</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span><strong>Time:</strong> {selectedJob.commute.transit.time}</span>
                          </div>
                          <p className="text-gray-600">
                            <strong>Route:</strong> {selectedJob.commute.transit.route}
                          </p>
                          <p className="text-gray-600 mt-2">
                            <strong>Insights:</strong> {selectedJob.commute.transit.insights}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Images */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">About {selectedJob.company}</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedJob.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Building2 className="w-12 h-12" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Workplace photos showing team environment and daily operations
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
