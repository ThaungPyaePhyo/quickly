import { useState } from 'react';
import { rateProvider } from '@/api/rating';

export default function RatingForm({ jobId, onSuccess }: { jobId: string; onSuccess: () => void }) {
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await rateProvider(jobId, score, comment);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <label>
        Rating:
        <select value={score} onChange={e => setScore(Number(e.target.value))} required>
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
      />
      <button type="submit">Submit Rating</button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}