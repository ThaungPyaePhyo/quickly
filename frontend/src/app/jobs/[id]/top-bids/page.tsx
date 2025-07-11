'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchTopBids, Bid } from '@/api/job';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Trophy, 
  DollarSign, 
  Clock, 
  Star, 
  User, 
  MessageSquare, 
  Award,
  Target,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function TopBidsPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  const { data: bids, isLoading, error } = useQuery<Bid[]>({
    queryKey: ['top-bids', jobId],
    queryFn: () => fetchTopBids(jobId),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading top bids...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <Trophy className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-800 font-medium mb-2">Failed to load top bids</p>
                <p className="text-red-600 text-sm">Please try again later</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Award className="w-5 h-5 text-gray-400" />;
      case 2: return <Target className="w-5 h-5 text-amber-600" />;
      default: return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return "1st Place";
      case 1: return "2nd Place";
      case 2: return "3rd Place";
      default: return `${index + 1}th Place`;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1: return "bg-gray-100 text-gray-800 border-gray-200";
      case 2: return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (bids && bids.length > 0) {
    console.log('Top Bids:', bids.map(bid => bid.provider?.name ?? bid.providerId));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${jobId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Job
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-lg mb-4 mx-auto">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Top Ranked Bids
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The highest performing bids for this job based on our ranking algorithm
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{bids?.length || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lowest Bid</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${bids?.length ? Math.min(...bids.map(b => b.price)) : 0}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Fastest ETA</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bids?.length ? Math.min(...bids.map(b => b.eta)) : 0}h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bids List */}
          {bids && bids.length === 0 ? (
            <Card className="bg-white border border-gray-200">
              <CardContent className="py-16 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bids yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Once professionals start bidding on this job, their rankings will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bids?.map((bid, idx) => (
                <Card key={bid.id} className={`bg-white border-2 transition-all hover:shadow-md ${
                  idx === 0 ? 'border-yellow-300 shadow-lg' : 'border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Rank Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          idx === 0 ? 'bg-yellow-50' : 
                          idx === 1 ? 'bg-gray-50' : 
                          idx === 2 ? 'bg-amber-50' : 'bg-blue-50'
                        }`}>
                          {getRankIcon(idx)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={`${getRankColor(idx)} border font-medium`}>
                            {getRankBadge(idx)}
                          </Badge>
                          
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">
                              Score: {bid.rankScore !== undefined && bid.rankScore !== null 
                                ? bid.rankScore.toFixed(2) 
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {bid.provider?.name ?? bid.providerId}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              ${bid.price}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-700">
                              {bid.eta} hours
                            </span>
                          </div>
                        </div>

                        {bid.note && (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-sm text-gray-700">
                              <MessageSquare className="w-4 h-4 inline mr-2 text-gray-500" />
                              <span className="font-medium">Note:</span> {bid.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-3">ℹ️ How We Rank Bids</h3>
            <p className="text-sm text-blue-800 mb-2">
              Our ranking algorithm considers multiple factors to help you find the best professionals:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Provider reputation and past performance</li>
              <li>• Competitive pricing relative to market rates</li>
              <li>• Realistic time estimates and availability</li>
              <li>• Quality of proposal and communication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}