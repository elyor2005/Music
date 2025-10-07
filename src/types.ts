export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  preview: string;
  lyrics: { time: number; text: string }[];
};
