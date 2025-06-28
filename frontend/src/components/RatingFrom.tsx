import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { rateProvider } from '@/api/rating';

export default function RatingForm({
  jobId,
  onSuccess,
}: {
  jobId: string;
  onSuccess: () => void;
}) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ score, comment }: { score: number; comment: string }) =>
      rateProvider(jobId, score, comment),
    onSuccess,
    onError: (err: any) => {
      setError(err?.message || 'Failed to submit rating');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({ score, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <label>
        Rating:
        <select
          value={score}
          onChange={e => setScore(Number(e.target.value))}
          required
          disabled={mutation.isPending}
        >
          <option value={0}>Select</option>
          <option value={5}>★★★★★</option>
          <option value={4}>★★★★</option>
          <option value={3}>★★★</option>
          <option value={2}>★★</option>
          <option value={1}>★</option>
        </select>
      </label>
      <textarea
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="border px-2 py-1 rounded"
        disabled={mutation.isPending}
      />
      <button type="submit" disabled={mutation.isPending || score === 0}>
        {mutation.isPending ? 'Submitting...' : 'Submit Rating'}
      </button>
      {mutation.isSuccess && (
        <div className="text-green-600">Thank you for your rating!</div>
      )}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}