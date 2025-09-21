export type MediaItem = {
  id: string;
  url: string; // data URL for image/file preview
  caption?: string;
};

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  school: string;
  gpa: number;
  skills: string;
  motivation: string;
  major: string;
  university: string;
  avatar?: MediaItem | null;
  activities: MediaItem[];
  awards: MediaItem[];
  works: MediaItem[];
  createdAt: number;
};

export type SortKey = 'firstName' | 'lastName' | 'gpa' | 'school' | 'createdAt';
