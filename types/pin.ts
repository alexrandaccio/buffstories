export interface DraftPin {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string | null;
}
