'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  id?: number;
  title: string;
  content: string;
  createdAt: string;
}

function PostDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/posts/${id}`).then(async (res) => {
      if (res.status === 404) router.push('/not-found');
      else {
        const data: Post = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      }
    });
  }, [id, router]);

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.push('/');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    setPost((prev) => (prev ? { ...prev, title, content } : prev));
    setIsEditing(false);
    router.refresh();
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      <button
        onClick={() => router.push('/')}
        className="btn btn-outline-secondary mb-3"
      >
        Back to Home
      </button>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setTitle(post.title);
              setContent(post.content);
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p className="text-muted">
            {new Date(post.createdAt).toLocaleDateString('id-ID')}
          </p>
          <p>{post.content}</p>
          <button onClick={handleDelete} className="btn btn-danger me-2">
            Delete
          </button>
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
            Update
          </button>
        </>
      )}
    </main>
  );
}

export default function PostDetail() {
  return (
    <Suspense fallback={<p className="container mt-4">Loading...</p>}>
      <PostDetailContent />
    </Suspense>
  );
}