
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image, FileText, Play } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'link';
  thumbnail_url?: string;
}

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const renderMedia = () => {
    switch (item.type) {
      case 'image':
        return (
          <AspectRatio ratio={16/9}>
            <img 
              src={item.url} 
              alt={item.title}
              className="w-full h-full object-cover rounded-t-md hover:opacity-90 transition-opacity"
            />
          </AspectRatio>
        );
      case 'video':
        return (
          <AspectRatio ratio={16/9}>
            <div className="relative w-full h-full bg-muted flex items-center justify-center">
              {item.thumbnail_url ? (
                <img 
                  src={item.thumbnail_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded-t-md"
                />
              ) : (
                <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                  <Play className="h-12 w-12 text-primary/50" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 hover:bg-black/70 transition-colors p-3 rounded-full">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </AspectRatio>
        );
      case 'pdf':
        return (
          <AspectRatio ratio={16/9}>
            <div className="w-full h-full bg-secondary/20 flex items-center justify-center rounded-t-md">
              <FileText className="h-16 w-16 text-primary/50" />
            </div>
          </AspectRatio>
        );
      case 'link':
        return (
          <AspectRatio ratio={16/9}>
            <div className="w-full h-full bg-secondary/20 flex items-center justify-center rounded-t-md">
              <ExternalLink className="h-16 w-16 text-primary/50" />
            </div>
          </AspectRatio>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      {renderMedia()}
      <CardContent className="p-4 text-right">
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardContent>
      {item.type === 'link' && (
        <CardFooter className="p-4 pt-0 justify-end">
          <Button asChild variant="secondary">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center">
              <span>מעבר לקישור</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
      {item.type === 'pdf' && (
        <CardFooter className="p-4 pt-0 justify-end">
          <Button asChild variant="secondary">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center">
              <span>פתיחת מסמך</span>
              <FileText className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
      {item.type === 'video' && (
        <CardFooter className="p-4 pt-0 justify-end">
          <Button asChild variant="secondary">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center">
              <span>צפייה בסרטון</span>
              <Play className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ItemCard;
