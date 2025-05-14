import React from 'react';
import { PortfolioItem } from '@/types';
import { Button } from './ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface Props {
  item: PortfolioItem;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  isAdmin?: boolean;
}

const PortfolioItemCard: React.FC<Props> = ({ item, onEdit, onDelete, onPreview, isAdmin = false }) => {
  const renderPreview = () => {
    if (!item.url) return null;

    if (item.type === 'image') {
      return (
        <img
          src={item.url}
          alt={item.title}
          className="object-cover w-full h-[220px] rounded-t-md"
        />
      );
    }

    if (item.type === 'video') {
      return (
        <video
          src={item.url}
          controls
          className="object-cover w-full h-[220px] rounded-t-md"
        />
      );
    }

    if (item.type === 'pdf') {
      return (
        <iframe
          src={item.url}
          className="w-full h-[220px] rounded-t-md"
          title={item.title}
        />
      );
    }

    if (item.type === 'url') {
      return (
        <iframe
          src={item.url}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-[220px] rounded-t-md"
          title={item.title}
        />
      );
    }

    return null;
  };

  return (
    <div className="relative rounded-md border border-gray-800 bg-gray-950 shadow-sm transition hover:shadow-lg overflow-hidden">
      {renderPreview()}

      <div className="flex flex-col p-3">
        <h4 className="text-right text-white text-sm">{item.title}</h4>
        <p className="text-right text-gray-400 text-xs">{item.type}</p>
      </div>

      {isAdmin && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
          <Button size="icon" variant="destructive" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
          <Button size="icon" variant="secondary" onClick={onEdit}>
            <Pencil size={16} />
          </Button>
          <Button size="icon" variant="default" onClick={onPreview}>
            <Eye size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PortfolioItemCard;