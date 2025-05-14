
import React from 'react';
import { PortfolioItem } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';
import { ExternalLink, Play, FilePdf } from 'lucide-react';

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onClick?: () => void;
}

const PortfolioItemCard: React.FC<PortfolioItemCardProps> = ({ item, onClick }) => {
  const getMediaPreview = () => {
    switch (item.type) {
      case 'image':
        return (
          <AspectRatio ratio={16 / 9}>
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover rounded-t-md transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        );
      case 'video':
        return (
          <AspectRatio ratio={16 / 9}>
            <div className="relative w-full h-full bg-black/10 rounded-t-md">
              <img 
                src={item.thumbnailUrl || item.url} 
                alt={item.title} 
                className="w-full h-full object-cover rounded-t-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="text-white" />
                </div>
              </div>
            </div>
          </AspectRatio>
        );
      case 'pdf':
        return (
          <AspectRatio ratio={16 / 9}>
            <div className="relative w-full h-full bg-secondary rounded-t-md flex items-center justify-center">
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded-t-md transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <FilePdf className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          </AspectRatio>
        );
      case 'url':
        return (
          <AspectRatio ratio={16 / 9}>
            <div className="relative w-full h-full bg-secondary rounded-t-md flex items-center justify-center">
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded-t-md transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <ExternalLink className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          </AspectRatio>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      {getMediaPreview()}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        {item.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
        )}
      </CardContent>
      {item.type === 'url' && (
        <CardFooter className="p-4 pt-0">
          <Link 
            to={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary flex items-center gap-1 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Site <ExternalLink className="w-3 h-3" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default PortfolioItemCard;
