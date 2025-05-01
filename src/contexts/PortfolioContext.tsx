
import React, { createContext, useState, useContext, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { toast } from "@/components/ui/use-toast";

interface PortfolioContextType {
  items: PortfolioItem[];
  addItem: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<PortfolioItem>) => void;
  deleteItem: (id: string) => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Sample data for initial state
const sampleItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'עיצוב אתר חברה',
    description: 'עיצוב ממשק משתמש עבור חברת טכנולוגיה',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'לוגו מותג אופנה',
    description: 'עיצוב לוגו לחברת אופנה חדשה',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'סרטון תדמית',
    description: 'סרטון פרסומי לחברת סטארט-אפ',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = () => {
      // In a real app, we would fetch from an API
      // For now, we'll load from localStorage or use sample data
      
      const storedItems = localStorage.getItem('portfolioItems');
      
      if (storedItems) {
        try {
          const parsedItems = JSON.parse(storedItems);
          // Convert string dates back to Date objects
          const itemsWithDates = parsedItems.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }));
          setItems(itemsWithDates);
        } catch (error) {
          console.error('Error parsing stored items:', error);
          setItems(sampleItems);
        }
      } else {
        // Use sample data for first load
        setItems(sampleItems);
        localStorage.setItem('portfolioItems', JSON.stringify(sampleItems));
      }
      
      setIsLoading(false);
    };
    
    loadItems();
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('portfolioItems', JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = (newItem: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const itemWithMetadata: PortfolioItem = {
      ...newItem,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    setItems(prevItems => [itemWithMetadata, ...prevItems]);
    
    toast({
      title: "פריט נוסף",
      description: `${newItem.title} נוסף בהצלחה לגלריה`,
    });
  };

  const updateItem = (id: string, updatedFields: Partial<PortfolioItem>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, ...updatedFields, updatedAt: new Date() } 
          : item
      )
    );
    
    toast({
      title: "פריט עודכן",
      description: "הפריט עודכן בהצלחה",
    });
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "פריט נמחק",
      description: itemToDelete ? `${itemToDelete.title} נמחק מהגלריה` : "הפריט נמחק בהצלחה",
    });
  };

  return (
    <PortfolioContext.Provider value={{ items, addItem, updateItem, deleteItem, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
