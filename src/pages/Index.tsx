
import React from 'react';
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import ItemCard from '@/components/ItemCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Item {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'link';
  thumbnail_url?: string;
}

// Fetcher function for SWR
const fetcher = async () => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Item[];
};

const Index = () => {
  const { data: items, error, isLoading } = useSWR('portfolio-items', fetcher);

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

        {error && (
          <div className="text-center text-destructive p-8">
            <p>שגיאה בטעינת הנתונים, אנא נסו שוב מאוחר יותר</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            renderSkeletons()
          ) : items && items.length > 0 ? (
            items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center p-8">
              <p>אין פריטים להצגה כרגע</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
