export interface Novel {
  id: string;
  title: string;
  slug: string;
  author: string;
  cover_url: string;
  synopsis: string;
  genre: string[]; // e.g. ["Fantasy", "Action"]
  tags: string[];  // e.g. ["Overpowered", "Magic"]
  status: 'Ongoing' | 'Completed';
  views: number;
  featured: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Chapter {
  id: string;
  novel_id: string;
  chapter_number: number;
  title: string;
  slug: string; // chapter slug, e.g. "chapter-1"
  content: string; // novel text content (HTML support)
  status: 'Draft' | 'Published';
  views: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Stats {
  totalNovels: number;
  totalChapters: number;
  totalViews: number;
  latestNovels: Novel[];
}
