'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobById, fetchBidsForJob, submitBid, acceptQuickBookJob, acceptBid, cancelJob, completeJob } from '@/api/job';
import { fetchMe } from '@/api/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RatingForm from '@/components/RatingForm';
import { useState } from 'react';
import { getJobRatings, Rating } from '@/api/rating';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye,
  Send,
  Timer,
  Trophy,
  Award,
  MessageCircle,
  User,
  Briefcase,
  Tag,
  ArrowLeft
} from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const userRole = user?.role;

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });

  const { data: bids, refetch: refetchBids } = useQuery({
    queryKey: ['bids', id],
    queryFn: () => fetchBidsForJob(id),
    enabled: !!id,
  });

  const { data: ratings } = useQuery<Rating[]>({
    queryKey: ['ratings', id],
    queryFn: () => getJobRatings(id),
    enabled: !!id,
  });

  const [bidPrice, setBidPrice] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [bidEta, setBidEta] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: countdown = 0 } = useQuery({
    queryKey: ['acceptCountdown', job?.id, job?.acceptUntil],
    queryFn: () => {
      if (!job?.acceptUntil) return 0;
      const now = Date.now();
      const until = new Date(job.acceptUntil).getTime();
      return Math.max(0, Math.floor((until - now) / 1000));
    },
    enabled: !!job?.acceptUntil && job.status === 'OPEN' && userRole === 'PROVIDER' && job.type === 'QUICK_BOOK',
    refetchInterval: 1000,
  });

  const userBid = bids?.find(bid => bid.provider?.id === user?.id);

  const bidMutation = useMutation({
    mutationFn: () => submitBid(id, { price: Number(bidPrice), note: bidNote, eta: Number(bidEta) }),
    onSuccess: () => {
      setBidPrice('');
      setBidNote('');
      setBidEta('');
      refetchBids();
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Bid submitted!');
    },
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
        toast.error((err as { message: string }).message);
      } else {
        setError('Failed to submit bid');
        toast.error('Failed to submit bid');
      }
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => {
      if (!job) throw new Error('Job not loaded');
      return acceptQuickBookJob(job.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job accepted!');
    },
    onError: () => {
      toast.error('Failed to accept job');
    }
  });

  const acceptBidMutation = useMutation({
    mutationFn: (bidId: string) => acceptBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['bids', id] });
      toast.success('Bid accepted!');
    },
    onError: () => {
      toast.error('Failed to accept bid');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      if (!job) throw new Error('Job not loaded');
      return cancelJob(job.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job cancelled.');
    },
    onError: () => {
      toast.error('Failed to cancel job');
    }
  });

  const completeMutation = useMutation({
    mutationFn: () => {
      if (!job) throw new Error('Job not loaded');
      return completeJob(job.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job marked as completed!');
    },
    onError: () => {
      toast.error('Failed to complete job');
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800';
      case 'BOOKED': return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="w-4 h-4" />;
      case 'BOOKED': return <CheckCircle className="w-4 h-4" />;
      case 'ASSIGNED': return <Clock className="w-4 h-4" />;
      case 'COMPLETED': return <Trophy className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">This job may have been removed or doesn't exist.</p>
          <Link href="/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const jobAlreadyRated =
    ratings &&
    job.providerId &&
    ratings.some(r => r.providerId === job.providerId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/jobs">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>

          {/* Job Header */}
          <Card className="mb-8 bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {job.type === 'QUICK_BOOK' ? 'Quick Book' : 'Post & Quote'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {job.title}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Price Badge */}
                <div className="flex flex-col gap-2">
                  {job.type === 'QUICK_BOOK' && job.price !== undefined && (
                    <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      ${job.price}
                    </div>
                  )}
                  {job.type === 'POST_AND_QUOTE' && job.acceptPrice !== undefined && (
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      ${job.acceptPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {job.category && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">Category:</span>
                    <span>{job.category.name}</span>
                  </div>
                )}
                
                {job.scheduledAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Scheduled:</span>
                    <span>{new Date(job.scheduledAt).toLocaleDateString()}</span>
                  </div>
                )}

                {job.type === 'POST_AND_QUOTE' && bids && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Bids:</span>
                    <span>{bids.length}</span>
                  </div>
                )}
              </div>

              {/* Scheduled Time for Quick Book */}
              {job.type === 'QUICK_BOOK' && job.scheduledAt && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Arrival Window:</span>
                    <span>
                      {new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(job.scheduledAt).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )}

              {/* Provider Info */}
              {job.provider && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Provider:</span>
                    <span>{job.provider.name}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Top Bids Button for Customers */}
          {userRole === 'CUSTOMER' && job.type === 'POST_AND_QUOTE' && job.status === 'OPEN' && (
            <div className="mb-6">
              <Link href={`/jobs/${job.id}/top-bids`}>
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  View Top Bids
                </Button>
              </Link>
            </div>
          )}

          {/* Quick Book Actions for Provider */}
          {userRole === 'PROVIDER' && job.type === 'QUICK_BOOK' && job.status === 'OPEN' && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Timer className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Quick Book Opportunity
                  </h2>
                  <p className="text-gray-600 mb-6">
                    First provider to accept wins this job!
                  </p>
                  
                  <Button
                    onClick={() => acceptMutation.mutate()}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 mb-4"
                    disabled={acceptMutation.isPending || countdown === 0}
                  >
                    {acceptMutation.isPending
                      ? 'Accepting...'
                      : countdown > 0
                        ? `Accept Job (${countdown}s)`
                        : 'Time Expired'}
                  </Button>

                  {countdown > 0 && (
                    <div className="text-sm text-gray-500 mb-4">
                      Time remaining to accept this job
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bid Submission Form for Providers */}
          {userRole === 'PROVIDER' && job.type === 'POST_AND_QUOTE' && job.status === 'OPEN' && (
            <Card className="mb-6 bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                {userBid ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Bid Submitted Successfully
                    </h3>
                    <p className="text-gray-600">
                      Your bid has been submitted. The customer will review all bids and contact you if selected.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Your Bid
                    </h2>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        bidMutation.mutate();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Price ($)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter your price"
                          value={bidPrice}
                          onChange={e => setBidPrice(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Time (hours)
                        </label>
                        <input
                          type="number"
                          placeholder="How long will it take?"
                          value={bidEta}
                          onChange={e => setBidEta(e.target.value)}
                          required
                          min={1}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          placeholder="Add any relevant details about your approach..."
                          value={bidNote}
                          onChange={e => setBidNote(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={bidMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {bidMutation.isPending ? 'Submitting...' : 'Submit Bid'}
                      </Button>
                      
                      {error && (
                        <div className="text-red-600 text-sm mt-2">
                          {error}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bids List for Customers */}
          {userRole === 'CUSTOMER' && user?.id === job.customerId && job.type === 'POST_AND_QUOTE' && bids && (
            <Card className="mb-6 bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Received Bids ({bids.length})
                </h2>
                
                {bids.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bids received yet. Check back later!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids
                      .sort((a, b) => a.price - b.price)
                      .map(bid => (
                        <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{bid.provider?.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${bid.price}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {bid.eta}h
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {job.status === 'OPEN' && (
                              <Button
                                onClick={() => acceptBidMutation.mutate(bid.id)}
                                disabled={acceptBidMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {acceptBidMutation.isPending ? 'Accepting...' : 'Accept Bid'}
                              </Button>
                            )}
                            
                            {job.providerId === bid.providerId && job.status === 'ASSIGNED' && (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Accepted
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {bid.note && (
                            <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                              <span className="font-medium">Note: </span>
                              {bid.note}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Complete Job Button for Provider */}
            {userRole === 'PROVIDER' &&
              (
                (job.type === 'POST_AND_QUOTE' && job.status === 'ASSIGNED' && job.providerId === user?.id) ||
                (job.type === 'QUICK_BOOK' && job.status === 'BOOKED' && job.providerId === user?.id)
              ) && (
                <Button
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completeMutation.isPending ? 'Completing...' : 'Mark as Completed'}
                </Button>
              )}

            {/* Cancel Job Button for Customer */}
            {userRole === 'CUSTOMER' && (job.status === 'OPEN' || job.status === 'BOOKED' || job.status === 'ASSIGNED') && (
              <Button
                variant="outline"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
              </Button>
            )}
          </div>

          {/* Rating Form for Completed Jobs */}
          {userRole === 'CUSTOMER' &&
            user?.id === job.customerId &&
            job.status === 'COMPLETED' &&
            job.providerId &&
            !jobAlreadyRated && (
              <Card className="mb-6 bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rate Your Provider
                  </h2>
                  <RatingForm
                    jobId={job.id}
                    onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ['ratings', id] });
                    }}
                  />
                </CardContent>
              </Card>
            )}

          {/* Rating Display */}
          {job.status === 'COMPLETED' && ratings && ratings.length > 0 && (
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Your Rating
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= ratings[0].score 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {ratings[0].score} out of 5
                  </span>
                </div>
                {ratings[0].comment && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 italic">
                      "{ratings[0].comment}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}