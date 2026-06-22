import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import LatestArticles from '../components/home/LatestArticles';
import CategoryGrid from '../components/home/CategoryGrid';
import QuoteSection from '../components/home/QuoteSection';
import NewsletterSection from '../components/home/NewsletterSection';

export default function Home() {
  const { data: articles = [] } = useQuery({
    queryKey: ['articles-home'],
    queryFn: () => base44.entities.Article.filter(
      { status: 'published' },
      '-publish_date',
      6
    ),
    initialData: [],
  });

  return (
    <div>
      <HeroSection />
      <LatestArticles articles={articles} />
      <QuoteSection />
      <CategoryGrid />
      <NewsletterSection />
    </div>
  );
}