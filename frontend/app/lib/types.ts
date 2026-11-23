export type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  colors: [string, string]; // two hex colors for the card image gradient
   // two hex colors for the card image gradient
  liveUrl: string; // "" when not set
  githubUrl: string;
  details: string; // longer text for the project page
  image: string; // "" when no image was uploaded
};

export type Profile = {
  profile: { name: string; role: string; location: string; about: string };
  skills: { group: string; items: string[] }[];
  experience: { year: string; title: string; detail: string }[];
  contact: { email: string; github: string; linkedin: string; whatsapp?: string };
  resumeUrl: string;
  //resumeUrl: string;
  photoUrl: string;
  now?: { text: string; updatedAt: string | null } | null;
};


export type AdminMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type ChatCard = { title: string; subtitle?: string; text?: string };
export type ChatLink = { label: string; href: string };
export type ChatReply = {
  reply: string;
  cards?: ChatCard[];
  links?: ChatLink[];
  suggestions: string[];
};

export type AdminAnalytics = {
  days: number;
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayVisitors: number;
  series: { date: string; views: number; visitors: number }[];
  pages: { name: string; count: number }[];
  referrers: { name: string; count: number }[];
  countries: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  recent: { time: string; path: string; country: string; device: string; referrer: string }[];
};
export type AdminStats = { projects: number; messages: number; unread: number };

export type ContactForm = { name: string; email: string; message: string };
export type ContactResult = { ok: boolean; error?: string; fields?: Partial<Record<keyof ContactForm, string>> };