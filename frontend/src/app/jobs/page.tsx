'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchJobs, Job } from '@/api/job';
import { fetchMe } from '@/api/user';
import { useState } from 'react';
import { Clock, DollarSign, Users, Calendar, Search, Plus, Briefcase, Tag, MapPin, Star, TrendingUp, Filter } from 'lucide-react';

export default function JobListPage() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });
  const userRole = user?.role;

  const [search, setSearch] = useState('');

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const filteredJobs = (userRole === 'CUSTOMER'
    ? jobs?.filter(job => job.customerId === user?.id)
    : jobs
  )?.filter(
    job =>
    (
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(search.toLowerCase())) ||
      (job.category && job.category.name.toLowerCase().includes(search.toLowerCase()))
    )
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800';
      case 'BOOKED': return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Find Jobs
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse available opportunities and find your next project
            </p>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, skills, or categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {userRole === 'CUSTOMER' && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/jobs/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Post a Job
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredJobs?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredJobs?.reduce((sum, job) => sum + (job._count?.bids || 0), 0) || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredJobs?.filter(j => j.status === 'OPEN').length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading jobs...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <Briefcase className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-800 font-medium mb-2">Failed to load jobs</p>
                <p className="text-red-600 text-sm">Please try again later</p>
              </div>
            </div>
          )}

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs?.length ? (
              filteredJobs.map(job => (
                <Link href={`/jobs/${job.id}`} key={job.id} className="h-full block">
                  <Card className="h-full bg-white hover:shadow-lg transition-shadow border border-gray-200">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          {job.type && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {job.type === 'QUICK_BOOK' ? 'Quick Book' : 'Post & Quote'}
                            </span>
                          )}
                        </div>
                        
                        {/* Price */}
                        {job.type === 'QUICK_BOOK' && job.price !== undefined && (
                          <div className="bg-green-50 text-green-800 px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.price}
                          </div>
                        )}
                        {job.type === 'POST_AND_QUOTE' && job.acceptPrice !== undefined && (
                          <div className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.acceptPrice}
                          </div>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {job.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {job.description}
                      </p>
                      
                      {/* Scheduled Date */}
                      {job.scheduledAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 px-3 py-2 rounded">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(job.scheduledAt).toLocaleDateString()} at {new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {job.category && (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                              <Tag className="w-3 h-3" />
                              {job.category.name}
                            </span>
                          )}
                        </div>
                        
                        {job.type === 'POST_AND_QUOTE' && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            {job._count?.bids ?? 0} bid{(job._count?.bids ?? 0) === 1 ? '' : 's'}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              !isLoading && (
                <div className="col-span-1 md:col-span-2 xl:col-span-3">
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="py-16 text-center">
                      <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No jobs found
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {userRole === 'CUSTOMER' 
                          ? 'Ready to get started? Post your first job and connect with professionals!' 
                          : 'New opportunities are posted daily. Check back soon!'
                        }
                      </p>
                      {userRole === 'CUSTOMER' && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href="/jobs/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Post Your First Job
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}