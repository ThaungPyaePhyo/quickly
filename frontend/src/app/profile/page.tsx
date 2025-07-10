'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMe, updateMe } from '@/api/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { User, Mail, Shield, Activity, CheckCircle, XCircle } from 'lucide-react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });
  const [toggleError, setToggleError] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: (isAvailable: boolean) => updateMe({ isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setToggleError(null);
    },
    onError: () => setToggleError('Failed to update availability'),
  });

  if (isLoading) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-slate-50 py-8 px-4">
        <div className="w-full max-w-md mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full mb-4"></div>
              <div className="w-32 h-6 bg-slate-200 rounded mb-2"></div>
              <div className="w-48 h-4 bg-slate-200 rounded mb-6"></div>
              <div className="w-full space-y-4">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-slate-50 py-8 px-4">
        <div className="w-full max-w-md mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Profile</h2>
            <p className="text-slate-600">Could not load your profile information. Please try again.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-50 py-8 px-4">
      <div className="w-full max-w-md mt-8">
        {/* Profile Header Card */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100">
                <AvatarFallback className="bg-slate-900 text-white text-xl font-semibold">
                  {user.name
                    ? user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-1">
                {user.name}
              </CardTitle>
              <div className="text-slate-500 text-sm font-medium">
                {user.email}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details Card */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-medium text-slate-900">Email</div>
                  <div className="text-sm text-slate-600">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-medium text-slate-900">Role</div>
                  <div className="text-sm text-slate-600">Account type</div>
                </div>
              </div>
              <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                {user.role}
              </span>
            </div>

            {/* Availability Toggle for Providers */}
            {user.role === 'PROVIDER' && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-slate-900">Availability</div>
                      <div className="text-sm text-slate-600">
                        {user.isAvailable ? 'Available for jobs' : 'Not available'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.isAvailable}
                      onCheckedChange={val => mutation.mutate(val)}
                      disabled={mutation.isPending}
                      className="data-[state=checked]:bg-green-600"
                    />
                    {user.isAvailable ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
                
                {/* Toggle Status Indicator */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className={`flex items-center gap-2 text-sm ${
                    user.isAvailable ? 'text-green-700' : 'text-slate-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      user.isAvailable ? 'bg-green-500' : 'bg-slate-400'
                    }`}></div>
                    {user.isAvailable ? 'Online and accepting jobs' : 'Offline - not accepting jobs'}
                  </div>
                </div>
                
                {mutation.isPending && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                      Updating availability...
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {toggleError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{toggleError}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}