import React, { useEffect, useState } from 'react';
import { PortfolioItem } from '@/types';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
  onView: (item: PortfolioItem) => void;
}

const PortfolioItemCard: React.FC<Props> = ({ item, onEdit, onDelete, onView }) => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (item.type === 'image' || item.type === 'video') {
      const media = new Image();
      media.src = item.url;
      media.onload = () => {
        setIsPortrait(media.naturalHeight > media.naturalWidth);
      };
    }
  }, [item.url, item.type]);

  const getMediaPreview = () => {
    switch (item.type) {
      case 'image':
        return <img src={item.url} alt={item.title} className="w-full h-full object-cover" />;
      case 'video':
        return (
          <video controls className="w-full h-full object-cover">
            <source src={item.url} />
          </video>
        );
      case 'pdf':
        return (
          <iframe src={item.url} className="w-full h-full border-none" title={item.title}></iframe>
        );
      case 'url':
        return (
          <iframe
            src={item.url}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
            title={item.title}
          ></iframe>
        );
      default:
        return <div className="w-full h-full flex items-center justify-center">No preview</div>;
    }
  };

  const cardHeight = isPortrait ? 'h-[360px]' : 'h-[200px]';
  const cardClass = `rounded-md overflow-hidden bg-[#14101d] border border-[#1c1c24] shadow-sm transition-all ${cardHeight}`;

  return (
    <div className={cardClass}>
      <div className="relative w-full h-full">
        {getMediaPreview()}

        {/* Action buttons on hover */}
        <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 hover:opacity-100 transition">
          <button
            className="mx-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded"
            onClick={() => onDelete(item)}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
          <button
            className="mx-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
            onClick={() => onEdit(item)}
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            className="mx-2 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
            onClick={() => onView(item)}
            title="View"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="p-2 text-right text-white text-sm">
        <div className="font-semibold">{item.title}</div>
        <div className="text-xs text-gray-400">{item.type}</div>
      </div>
    </div>
  );
};

export default PortfolioItemCard;