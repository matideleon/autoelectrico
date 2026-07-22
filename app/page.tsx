'use client';

import Nav from '@/components/Nav';
import NewsFeed from '@/components/NewsFeed';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Home() {
  return (
    <>
      <Nav />
      <NewsFeed />
      <NewsletterSignup />
    </>
  );
}
