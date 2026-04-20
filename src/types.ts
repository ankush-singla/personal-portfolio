export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  link?: string;
  isEducation?: boolean;
  group?: string;
  motivation?: string;
}

export interface OtherRole {
  org: string;
  role: string;
  period: string;
  link?: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  aspectRatio: string;
  year: string;
  deepDive?: string;
  articleLink?: string;
  articleCtaText?: string;
  screenshots?: { url: string; caption: string }[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  focus: string;
}

export interface TechStack {
  building: string[];
  workflow: string[];
  other: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export type ThemeType = 'monolith' | '8bit' | 'minimal' | 'cyberpunk' | 'basketball' | 'photography' | 'terminal';

export interface ThemeConfig {
  name: ThemeType;
  colors: {
    surface: string;
    primary: string;
    secondary: string;
    text: string;
  };
  fontFamily: {
    serif: string;
    sans: string;
  };
  borderRadius: string;
}
