import React, { useState } from 'react';
import { PortfolioItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<PortfolioItem>;
  mode: 'add' | 'edit';
}

const ItemForm: React.FC<ItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const { toast } = useToast();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [type, setType] = useState<'image' | 'video' | 'url' | 'pdf'>(initialData?.type || 'url');
  const [isUploading, setIsUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || (!url.trim() && !file)) {
      toast({ title: 'נא להזין שם וקובץ או קישור' });
      return;
    }

    onSubmit({ title, description, url, type });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile(selected);
      setUrl(URL.createObjectURL(selected));

      if (selected.type.startsWith('image/')) setType('image');
      else if (selected.type.startsWith('video/')) setType('video');
      else if (selected.type === 'application/pdf') setType('pdf');
      else setType('url');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>הוספת פריט חדש</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">כותרת</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">תיאור (אופציונלי)</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="url">קישור</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>

          <div>
            <input type="file" accept="image/*,video/*,application/pdf" onChange={handleFileChange} />
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" variant="default">
              {mode === 'add' ? 'הוספה' : 'שמירה'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;