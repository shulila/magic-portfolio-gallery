import React from 'react';
import { PortfolioItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface Props {
  item: PortfolioItem;
  onDelete?: () => void;
  onEdit?: () => void;
  onPreview?: () => void;
}

const PortfolioItemCard: React.FC<Props> = ({ item, onDelete, onEdit, onPreview }) => {
  const renderPreview = () => {
    if (item.type === 'image') {
      return <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-t" />;
    }

    if (item.type === 'video') {
      return (
        <video controls className="w-full h-48 object-cover rounded-t">
          <source src={item.url} type="video/mp4" />
          הדפדפן שלך אינו תומך בניגון וידאו.
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

    // ברירת מחדל: לינק
    return (
      <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t text-4xl text-white">
        🔗
      </div>
    );
  };

  return (
    <Card dir="rtl">
      {renderPreview()}

      <CardContent className="p-4 space-y-1">
        <div className="flex justify-between items-center">
          <div className="text-right">
            <div className="text-white font-semibold">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.type}</div>
          </div>
          <div className="flex space-x-2">
            {onDelete && (
              <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            )}
            {onEdit && (
              <button onClick={onEdit} className="text-purple-400 hover:text-purple-600">
                <Pencil size={18} />
              </button>
            )}
            {onPreview && (
              <button onClick={onPreview} className="text-white hover:text-gray-300">
                <Eye size={18} />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioItemCard;
