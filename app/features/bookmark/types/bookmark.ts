export type Bookmark = {
  id: number;
  slug: string;
  url: string;
  title: string | null;
  ogpImageUrl: string | null;
  comment: string | null;
  createdAt: Date;
};
