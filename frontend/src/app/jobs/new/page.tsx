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

export default function NewJobPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'QUICK_BOOK' | 'POST_AND_QUOTE'>('QUICK_BOOK');
    const [error, setError] = useState<string | null>(null);

    const { data: categories = [], isLoading: loadingCategories } = useQuery({
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        onSuccess: () => router.push('/jobs'),
        onError: (err: unknown) => {
            if (err instanceof Error) setError(err.message || 'Job creation failed');
            else setError('Job creation failed');
        },
    });

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-600 text-center">
                        Post a New Job
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setError(null);
                            mutation.mutate();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <Input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                        <Input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    value="QUICK_BOOK"
                                    checked={type === 'QUICK_BOOK'}
                                    onChange={() => setType('QUICK_BOOK')}
                                    className="accent-blue-600"
                                />
                                Quick Book
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    value="POST_AND_QUOTE"
                                    checked={type === 'POST_AND_QUOTE'}
                                    onChange={() => setType('POST_AND_QUOTE')}
                                    className="accent-blue-600"
                                />
                                Post and Quote
                            </label>
                        </div>
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Posting...' : 'Post Job'}
                        </Button>
                        {error && <div className="text-red-600 text-center">{error}</div>}
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}