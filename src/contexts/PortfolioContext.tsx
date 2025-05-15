
import React, { createContext, useState, useContext, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { toast } from "@/components/ui/use-toast";

interface PortfolioContextType {
  items: PortfolioItem[];
  addItem: (item: Omit<PortfolioItem, 'id' | 'created_at'>) => void;
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
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'לוגו מותג אופנה',
    description: 'עיצוב לוגו לחברת אופנה חדשה',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'סרטון תדמית',
    description: 'סרטון פרסומי לחברת סטארט-אפ',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    created_at: new Date().toISOString(),
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
          setItems(parsedItems);
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

  const addItem = (newItem: Omit<PortfolioItem, 'id' | 'created_at'>) => {
    const now = new Date();
    const itemWithMetadata: PortfolioItem = {
      ...newItem,
      id: crypto.randomUUID(),
      created_at: now.toISOString(),
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
          ? { ...item, ...updatedFields } 
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
