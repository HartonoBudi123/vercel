'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function EditPostContent() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(async (res) => {
      if (res.status === 404) {
        router.push('/not-found');
      } else {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      }
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    router.push(`/post/${id}`);
  };

  if (loading) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="d-flex gap-2">
          <Link href={`/post/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}

export default function EditPost() {
  return (
    <Suspense fallback={<p className="container mt-4">Loading...</p>}>
      <EditPostContent />
    </Suspense>
  );
}