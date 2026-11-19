export type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  colors: [string, string]; // two hex colors for the card image gradient
};

export type Profile = {
  profile: { name: string; role: string; location: string; about: string };
  skills: { group: string; items: string[] }[];
  experience: { year: string; title: string; detail: string }[];
  contact: { email: string; github: string; linkedin: string };
  resumeUrl: string;
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
export type AdminStats = { projects: number; messages: number; unread: number };

export type ContactForm = { name: string; email: string; message: string };
export type ContactResult = { ok: boolean; error?: string; fields?: Partial<Record<keyof ContactForm, string>> };