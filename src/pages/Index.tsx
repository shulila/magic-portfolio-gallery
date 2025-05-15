import React from 'react';
import { usePortfolio } from '@/contexts/portfolio-context';
import Gallery from './Gallery';

const IndexPage = () => {
  const { displayItems } = usePortfolio();

  return (
    <main className="min-h-screen w-full p-4">
      <h1 className="text-xl font-semibold mb-4 text-center">כל היצירות שלי במקום אחד</h1>
      <Gallery />
    </main>
  );
};

export default IndexPage;
