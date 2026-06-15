import { NavigationItem } from './types';

export const DEFAULT_ITEMS: NavigationItem[] = [
  {
    id: 'english-vocab',
    title: '英语背单词',
    url: 'https://english-vocab-app-phi.vercel.app/',
    description: '高效好用的英语词汇记忆与复习平台，包含丰富的单词词库与科学记忆算法。支持自定义词单，通过艾宾浩斯记忆法帮助你加深记忆。',
    language: '英语',
    category: '词汇背诵',
    iconName: 'BookOpen',
    colorTheme: 'blue',
    isDefault: true
  },
  {
    id: 'french-vocab',
    title: '法语背单词',
    url: 'https://french-words-study.vercel.app/',
    description: '精心雕琢的法语词汇学习助手，支持标准音标发音、生动例句以及拼写渐进式自我检测。专为法语词汇量突破而设计。',
    language: '法语',
    category: '词汇背诵',
    iconName: 'Sparkles',
    colorTheme: 'indigo',
    isDefault: true
  },
  {
    id: 'lumni-french',
    title: 'Lumni 法语学习',
    url: 'https://www.lumni.fr',
    description: '法国官方多媒体核心教育平台。提供海量优质的听力、视频、阅读及全方位法国文化、历史学习素材，原汁原味的沉浸式法语学习体验。',
    language: '法语',
    category: '综合学习',
    iconName: 'Compass',
    colorTheme: 'rose',
    isDefault: true
  }
];

export const AVAILABLE_ICONS = [
  { name: 'BookOpen', label: '书本' },
  { name: 'Sparkles', label: '星格/闪烁' },
  { name: 'Compass', label: '指南针' },
  { name: 'Languages', label: '语言' },
  { name: 'GraduationCap', label: '毕业帽' },
  { name: 'Lightbulb', label: '灵感/灯泡' },
  { name: 'Globe', label: '地球/国际' },
  { name: 'Bookmark', label: '书签' },
  { name: 'PenTool', label: '写作/钢笔' }
];

export const THEME_COLORS = [
  { key: 'blue', name: '蔚蓝', bg: 'bg-blue-50/50 hover:bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-200/50 hover:border-blue-400', badge: 'bg-blue-100 text-blue-800' },
  { key: 'indigo', name: '靛青', bg: 'bg-indigo-50/50 hover:bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-200/50 hover:border-indigo-400', badge: 'bg-indigo-100 text-indigo-800' },
  { key: 'rose', name: '玫瑰红', bg: 'bg-rose-50/50 hover:bg-rose-50/80', text: 'text-rose-600', border: 'border-rose-200/50 hover:border-rose-400', badge: 'bg-rose-100 text-rose-800' },
  { key: 'emerald', name: '祖母绿', bg: 'bg-emerald-50/50 hover:bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-200/50 hover:border-emerald-400', badge: 'bg-emerald-100 text-emerald-800' },
  { key: 'amber', name: '琥珀黄', bg: 'bg-amber-50/50 hover:bg-amber-50/80', text: 'text-amber-600', border: 'border-amber-200/50 hover:border-amber-400', badge: 'bg-amber-100 text-amber-800' },
  { key: 'purple', name: '紫罗兰', bg: 'bg-purple-50/50 hover:bg-purple-50/80', text: 'text-purple-600', border: 'border-purple-200/50 hover:border-purple-400', badge: 'bg-purple-100 text-purple-800' },
  { key: 'slate', name: '岩板灰', bg: 'bg-slate-50/50 hover:bg-slate-50/80', text: 'text-slate-600', border: 'border-slate-200/50 hover:border-slate-400', badge: 'bg-slate-100 text-slate-800' }
];
