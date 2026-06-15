export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  description: string;
  language: '英语' | '法语' | '其他';
  category: string;
  iconName: string; // From lucide-react (e.g., 'BookOpen', 'Sparkles', 'Compass', 'Languages', 'GraduationCap', 'Activity', 'Search', 'Lightbulb')
  colorTheme: 'blue' | 'indigo' | 'rose' | 'emerald' | 'amber' | 'purple' | 'slate';
  isDefault?: boolean;
}

export type GridCols = 'auto' | '1' | '2' | '3' | '4';

export type CardStyle = 'neo-brutalist' | 'minimal-modern' | 'glassmorphism' | 'gradient-glowing';
