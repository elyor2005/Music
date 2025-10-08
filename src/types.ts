export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  preview: string;
  lyrics: { time: number; text: string }[];
  coverUrl: string;
  previewUrl: string;
  createdAt: Date;
};
