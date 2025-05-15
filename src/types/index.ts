export type PortfolioItem = {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video' | 'url' | 'pdf';
  description?: string;
  created_at?: string;
  platform?: string;
  prompt?: string;
};
