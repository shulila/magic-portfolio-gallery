
import React, { useState } from 'react';
import { PortfolioItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Link, Image, FileVideo, Upload } from 'lucide-react';

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
  mode
}) => {
  const { toast } = useToast();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<'image' | 'video' | 'url'>(initialData?.type || 'image');
  const [url, setUrl] = useState(initialData?.url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נא להזין כותרת לפריט",
      });
      return;
    }
    
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נא להזין כתובת URL לתמונה, סרטון או קישור",
      });
      return;
    }
    
    onSubmit({
      title,
      description: description || undefined,
      type,
      url,
      thumbnailUrl: thumbnailUrl || undefined,
    });
    
    onClose();
  };

  const simulateFileUpload = () => {
    setIsUploading(true);
    
    // Simulate file upload delay
    setTimeout(() => {
      const imageUrls = [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        'https://images.unsplash.com/photo-1483058712412-4245e9b90334'
      ];
      
      const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      setUrl(randomUrl);
      setIsUploading(false);
      
      toast({
        title: "קובץ הועלה בהצלחה",
        description: "התמונה הועלתה והוספה לטופס",
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'הוספת פריט חדש' : 'עריכת פריט'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">כותרת</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="שם העבודה"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">תיאור (אופציונלי)</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="תיאור קצר של העבודה"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label>סוג פריט</Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as 'image' | 'video' | 'url')}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="image" id="type-image" />
                <Label htmlFor="type-image" className="cursor-pointer flex items-center gap-2">
                  <Image className="w-4 h-4" /> תמונה
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="video" id="type-video" />
                <Label htmlFor="type-video" className="cursor-pointer flex items-center gap-2">
                  <FileVideo className="w-4 h-4" /> סרטון
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="url" id="type-url" />
                <Label htmlFor="type-url" className="cursor-pointer flex items-center gap-2">
                  <Link className="w-4 h-4" /> קישור חיצוני
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">{type === 'url' ? 'קישור' : type === 'video' ? 'קישור לסרטון' : 'קישור לתמונה'}</Label>
            <div className="flex gap-2">
              <Input 
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={type === 'url' ? 'https://example.com' : type === 'video' ? 'https://youtube.com/...' : 'https://example.com/image.jpg'}
                className="flex-1"
              />
              
              {(type === 'image' || type === 'video') && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={simulateFileUpload}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'מעלה...' : 'העלאה'}
                </Button>
              )}
            </div>
          </div>
          
          {(type === 'video' || type === 'url') && (
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">קישור לתמונה ממוזערת (אופציונלי)</Label>
              <Input 
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          )}
          
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'הוספה' : 'שמירה'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
