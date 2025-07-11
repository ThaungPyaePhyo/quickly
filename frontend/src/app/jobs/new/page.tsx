'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { createJob } from '@/api/job';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/api/category';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from 'react-hot-toast';
import { Plus, ArrowLeft, DollarSign, FileText, Tag, Zap, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'QUICK_BOOK' | 'POST_AND_QUOTE'>('QUICK_BOOK');
    const [error, setError] = useState<string | null>(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const mutation = useMutation({
        mutationFn: () =>
            createJob({
                title,
                description,
                price: Number(price),
                categoryId: category,
                type,
                status: 'OPEN',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        onSuccess: () => {
            toast.success('Job posted successfully!');
            router.push('/jobs')
        },
        onError: (err: unknown) => {
            if (err instanceof Error) setError(err.message || 'Job creation failed');
            else setError('Job creation failed');
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/jobs">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Jobs
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-slate-900 rounded-lg mb-4 mx-auto">
                                <Plus className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                Post a New Job
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Find the perfect professional for your project
                            </p>
                        </div>
                    </div>

                    {/* Job Type Selection */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Job Type</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    type === 'QUICK_BOOK' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setType('QUICK_BOOK')}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        type === 'QUICK_BOOK' ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}>
                                        <Zap className={`w-5 h-5 ${type === 'QUICK_BOOK' ? 'text-white' : 'text-gray-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Quick Book</h3>
                                        <p className="text-sm text-gray-600">Fixed price, instant booking</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Get started immediately</span>
                                </div>
                            </div>

                            <div 
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    type === 'POST_AND_QUOTE' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setType('POST_AND_QUOTE')}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        type === 'POST_AND_QUOTE' ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}>
                                        <MessageSquare className={`w-5 h-5 ${type === 'POST_AND_QUOTE' ? 'text-white' : 'text-gray-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Post & Quote</h3>
                                        <p className="text-sm text-gray-600">Receive bids from professionals</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Compare offers and choose</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Details Form */}
                    <Card className="bg-white shadow-sm border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Job Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    setError(null);
                                    mutation.mutate();
                                }}
                                className="space-y-6"
                            >
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Job Title
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="e.g., Fix leaky faucet in kitchen"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <Textarea
                                        placeholder="Describe your project in detail. Include any specific requirements, timeline, or preferences..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-2" />
                                        {type === 'QUICK_BOOK' ? 'Fixed Price' : 'Budget Range'}
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="number"
                                            placeholder={type === 'QUICK_BOOK' ? '150' : '100-200'}
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            required
                                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {type === 'QUICK_BOOK' 
                                            ? 'Set a fixed price for your job' 
                                            : 'Enter your estimated budget to help professionals bid appropriately'
                                        }
                                    </p>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 inline mr-2" />
                                        Category
                                    </label>
                                    <Select value={category} onValueChange={setCategory} required>
                                        <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <SelectValue placeholder="Select a category for your job" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-red-800">{error}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <Button 
                                        type="submit" 
                                        disabled={mutation.isPending}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Posting Job...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Post Job
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tips Section */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-medium text-blue-900 mb-3">💡 Tips for a Great Job Post</h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>• Be specific about what you need done</li>
                            <li>• Include any relevant details about timing or materials</li>
                            <li>• Set a realistic budget for quality work</li>
                            <li>• Choose the most relevant category to attract the right professionals</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}