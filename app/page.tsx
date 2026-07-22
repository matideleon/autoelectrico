'use client';

import Nav from '@/components/Nav';
import NewsFeed from '@/components/NewsFeed';
import NewsletterSignup from '@/components/NewsletterSignup';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <>
      <Nav />
      <NewsFeed />
      <NewsletterSignup />
      <ChatWidget />
    </>
  );
}
