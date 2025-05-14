import React, { useState } from 'react';
import { PortfolioItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

interface Props {
  item: PortfolioItem;
  onEdit: () => void;
  onPreview: () => void;
}

const PortfolioItemCard: React.FC<Props> = ({ item, onEdit, onPreview }) => {
  const { deleteItem } = usePortfolio();
  const [isHovered, setIsHovered] = useState(false);

  const renderPreview = () => {
    if (item.type === 'image') {
      return <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-t" />;
    }
    if (item.type === 'video') {
      return (
        <video controls className="w-full h-48 object-cover rounded-t">
          <source src={item.url} />
          Your browser does not support the video tag.
        </video>
      );
    }
    if (item.type === 'pdf') {
      return (
        <iframe
          src={item.url}
          className="w-full h-48 object-cover rounded-t"
          title={item.title}
        />
      );
    }
    if (item.type === 'url') {
      return (
        <iframe
          src={item.url}
          className="w-full h-48 object-cover rounded-t"
          title={item.title}
        />
      );
    }
    return (
      <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t text-4xl text-white">
        🔗
      </div>
    );
  };

  return (
    <Card
      className="overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative">
        {renderPreview()}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex justify-center items-center gap-4">
            <Button size="icon" variant="destructive" onClick={() => deleteItem(item.id)}>
              <Trash2 size={18} />
            </Button>
            <Button size="icon" onClick={onEdit}>
              <Pencil size={18} />
            </Button>
            <Button size="icon" onClick={onPreview}>
              <Eye size={18} />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-right font-bold">{item.title}</p>
        <p className="text-xs text-muted-foreground text-right">{item.type}</p>
      </CardContent>
    </Card>
  );
};

export default PortfolioItemCard;