
import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PortfolioItemCard from '@/components/PortfolioItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { PortfolioItem } from '@/types';

const Index = () => {
  const { items, isLoading } = usePortfolio();
  const navigate = useNavigate();

  // Handler to navigate to gallery with the selected item
  const handleItemPreview = (item: PortfolioItem) => {
    navigate('/gallery');
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, i) => (
      <div key={`skeleton-${i}`} className="h-[300px]">
        <Skeleton className="h-[200px] w-full rounded-t-md" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary md:text-5xl mb-4">
            תיק העבודות של שילה
          </h1>
          <p className="text-xl text-muted-foreground">
            כל היצירות שלי במקום אחד
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <PortfolioItemCard 
                key={item.id} 
                item={item} 
                onPreview={handleItemPreview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <p>אין פריטים להצגה כרגע</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
