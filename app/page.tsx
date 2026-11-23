import { Suspense } from 'react';
import { connection } from 'next/server';
import Link from 'next/link';
import { db } from '@/db';
import { posts } from '@/db/schema';

async function getPosts() {
  await connection();
  return db.select().from(posts);
}

async function PostList() {
  const allPosts = await getPosts();

  return allPosts.length === 0 ? (
    <p>No posts yet.</p>
  ) : (
    <ul className="list-group">
      {allPosts.map((post) => (
        <li key={post.id} className="list-group-item">
          <Link href={`/post/${post.id}`}>
            {post.title}
          </Link>
          <span className="text-muted float-end">
            {post.createdAt && new Date(post.createdAt).toLocaleDateString('id-ID')}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="container mt-4">
      <h1>Blog Posts</h1>
      <Link href="/create" className="btn btn-primary mb-3">
        Create Post
      </Link>
      <Suspense fallback={<p>Loading...</p>}>
        <PostList />
      </Suspense>
    </main>
  );
}