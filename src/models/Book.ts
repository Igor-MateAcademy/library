export interface Book {
  id: number;
  busy: boolean;
  excluded: boolean;
  reasonExclude: string | null;
  title: string;
  author: string;
  publisher: string;
  year: number;
  genre: string;
  numberOfPage: number;
}
