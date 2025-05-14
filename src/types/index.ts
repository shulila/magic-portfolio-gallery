
export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'url' | 'pdf';
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  email: string | null;
}
