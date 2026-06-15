import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Compass,
  Languages,
  GraduationCap,
  Lightbulb,
  Globe,
  Bookmark,
  PenTool,
  Search,
  Plus,
  RotateCcw,
  LayoutGrid,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
  Trash2,
  ArrowUpRight,
  Sparkle
} from 'lucide-react';
import { NavigationItem, CardStyle, GridCols } from './types';
import { DEFAULT_ITEMS, AVAILABLE_ICONS, THEME_COLORS } from './data';

// Dynamic Icon rendering component lookup
const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    BookOpen,
    Sparkles,
    Compass,
    Languages,
    GraduationCap,
    Lightbulb,
    Globe,
    Bookmark,
    PenTool
  };
  const SelectedIcon = icons[name] || Globe;
  return <SelectedIcon className={className || "w-6 h-6"} />;
};

export default function App() {
  // State for Navigation cards
  const [items, setItems] = useState<NavigationItem[]>(() => {
    const saved = localStorage.getItem('lang-navigation-items');
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  // State for search, filter and visual configurations
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'全部' | '英语' | '法语' | '其他'>('全部');
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('glassmorphism');
  const [gridCols, setGridCols] = useState<GridCols>('auto');

  // Form input state for adding dynamic cards
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [newCard, setNewCard] = useState<Omit<NavigationItem, 'id' | 'isDefault'>>({
    title: '',
    url: '',
    description: '',
    language: '英语',
    category: '词汇背诵',
    iconName: 'BookOpen',
    colorTheme: 'blue'
  });

  // State for notifications
  const [toastMessage, setToastMessage] = useState('');

  // Persist items to local storage
  useEffect(() => {
    localStorage.setItem('lang-navigation-items', JSON.stringify(items));
  }, [items]);

  // Autosave styles to localStorage for a continuous stateful feel
  useEffect(() => {
    const savedStyle = localStorage.getItem('lang-navigation-style');
    if (savedStyle) setSelectedStyle(savedStyle as CardStyle);
    const savedCols = localStorage.getItem('lang-navigation-cols');
    if (savedCols) setGridCols(savedCols as GridCols);
  }, []);

  const handleStyleChange = (style: CardStyle) => {
    setSelectedStyle(style);
    localStorage.setItem('lang-navigation-style', style);
  };

  const handleColsChange = (cols: GridCols) => {
    setGridCols(cols);
    localStorage.setItem('lang-navigation-cols', cols);
  };

  // Quick reset to default links
  const handleReset = () => {
    if (window.confirm('您确定要恢复到默认的 3 个语言学习卡片吗？这会清除您自定义添加的链接。')) {
      setItems(DEFAULT_ITEMS);
      setSearchQuery('');
      setFilterLanguage('全部');
      showToast('已恢复默认导航卡片 🔄');
    }
  };

  // Showing elegant mini overlay toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Form submit handler
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!newCard.title.trim()) {
      setFormError('请输入卡片标题！');
      return;
    }
    if (!newCard.url.trim()) {
      setFormError('请输入网站链接！');
      return;
    }
    
    // Quick URL format check
    let formattedUrl = newCard.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      new URL(formattedUrl);
    } catch (_) {
      setFormError('请输入有效的 URL 地址。');
      return;
    }

    if (!newCard.description.trim()) {
      setFormError('为了卡片美观，请填写一小段描述。');
      return;
    }

    const newItem: NavigationItem = {
      id: 'custom-' + Date.now(),
      title: newCard.title.trim(),
      url: formattedUrl,
      description: newCard.description.trim(),
      language: newCard.language,
      category: newCard.category.trim() || '自主学习',
      iconName: newCard.iconName,
      colorTheme: newCard.colorTheme,
      isDefault: false
    };

    setItems(prev => [...prev, newItem]);
    setModalOpen(false);
    showToast('新导航卡片添加成功 🎉');
    
    // Reset form fields
    setNewCard({
      title: '',
      url: '',
      description: '',
      language: '英语',
      category: '词汇背诵',
      iconName: 'BookOpen',
      colorTheme: 'blue'
    });
  };

  // Delete handler for custom links
  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open card link
    if (window.confirm('确定要删除这个自定义导航吗？')) {
      setItems(prev => prev.filter(item => item.id !== id));
      showToast('卡片已成功移除 🗑️');
    }
  };

  // Filtering list based on search and selected filter tags
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = filterLanguage === '全部' || item.language === filterLanguage;

    return matchesSearch && matchesLang;
  });

  // Theme styling map for specific styles
  const styleStyles = {
    'minimal-modern': {
      bodyClass: 'bg-slate-50 text-slate-800 font-sans',
      headerCardClass: 'bg-white border border-slate-200/65 shadow-sm rounded-3xl',
      cardClass: (color: string) => `bg-white border border-slate-200/70 hover:border-${color}-300 hover:shadow-xl hover:shadow-${color}-500/5 transition-all duration-300 rounded-2xl p-6 relative group flex flex-col justify-between h-full`,
      badgeClass: 'px-2.5 py-0.5 rounded-full text-xs font-medium',
      tagColor: 'bg-slate-100 text-slate-700'
    },
    'glassmorphism': {
      bodyClass: 'bg-[#0f172a] text-white font-sans relative overflow-x-hidden',
      headerCardClass: 'backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] rounded-[40px]',
      cardClass: (color: string) => `backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 rounded-[40px] p-8 relative group flex flex-col justify-between h-full hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]`,
      badgeClass: 'px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md bg-white/10 border border-white/5',
      tagColor: 'bg-white/10 text-slate-200'
    },
    'neo-brutalist': {
      bodyClass: 'bg-[#faf6eb] text-slate-900 font-sans',
      headerCardClass: 'bg-white border-3 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-none',
      cardClass: (color: string) => `bg-white border-3 border-slate-900 shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 rounded-none p-6 relative group flex flex-col justify-between h-full`,
      badgeClass: 'px-2.5 py-0.5 border border-slate-900 text-xs font-bold uppercase tracking-wider',
      tagColor: 'bg-slate-100 text-slate-900 border border-slate-900'
    },
    'gradient-glowing': {
      bodyClass: 'bg-[#030712] text-slate-100 font-sans',
      headerCardClass: 'bg-slate-900/40 border border-slate-800 shadow-[0_0_50px_rgba(30,58,138,0.2)] rounded-3xl',
      cardClass: (color: string) => `bg-slate-900 border border-slate-800/80 hover:border-${color}-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 rounded-2xl p-6 relative group overflow-hidden flex flex-col justify-between h-full`,
      badgeClass: 'px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700/50',
      tagColor: 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
    }
  }[selectedStyle];

  // Helper theme-to-color utilities
  const getColorClasses = (color: string, style: CardStyle) => {
    if (style === 'neo-brutalist') {
      const brutColors: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-900 border border-slate-900',
        indigo: 'bg-indigo-100 text-indigo-900 border border-slate-900',
        rose: 'bg-rose-100 text-rose-900 border border-slate-900',
        emerald: 'bg-emerald-100 text-emerald-900 border border-slate-900',
        amber: 'bg-amber-100 text-amber-900 border border-slate-900',
        purple: 'bg-purple-100 text-purple-900 border border-slate-900',
        slate: 'bg-slate-100 text-slate-900 border border-slate-900'
      };
      return {
        badge: brutColors[color] || brutColors.slate,
        iconBg: 'bg-white border-2 border-slate-900 p-2.5 inline-flex',
        iconText: 'text-slate-900',
        btnClass: 'bg-black text-white hover:bg-slate-800 font-bold px-4 py-2 border-2 border-slate-900 transition-all duration-150 rounded-none'
      };
    }

    if (style === 'glassmorphism') {
      const glassColors: Record<string, { badge: string; iconBg: string; text: string }> = {
        blue: { badge: 'bg-blue-500/20 text-blue-300 border border-blue-400/20', iconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20', text: 'text-blue-400' },
        indigo: { badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/20', iconBg: 'bg-indigo-500/10 group-hover:bg-indigo-500/20', text: 'text-indigo-400' },
        rose: { badge: 'bg-rose-500/20 text-rose-300 border border-rose-400/20', iconBg: 'bg-rose-500/10 group-hover:bg-rose-500/20', text: 'text-rose-400' },
        emerald: { badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20', iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20', text: 'text-emerald-400' },
        amber: { badge: 'bg-amber-500/20 text-amber-300 border border-amber-400/20', iconBg: 'bg-amber-500/10 group-hover:bg-amber-500/20', text: 'text-amber-400' },
        purple: { badge: 'bg-purple-500/20 text-purple-300 border border-purple-400/20', iconBg: 'bg-purple-500/10 group-hover:bg-purple-500/20', text: 'text-purple-400' },
        slate: { badge: 'bg-slate-500/20 text-slate-300 border border-slate-400/20', iconBg: 'bg-slate-500/10 group-hover:bg-slate-500/20', text: 'text-slate-400' }
      };
      
      const config = glassColors[color] || glassColors.slate;
      return {
        badge: config.badge,
        iconBg: `${config.iconBg} p-3 rounded-xl transition-colors duration-300`,
        iconText: config.text,
        btnClass: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-xl transition-colors duration-200 border border-white/10 py-2.5 px-4 font-medium'
      };
    }

    if (style === 'gradient-glowing') {
      const neonColors: Record<string, { badge: string; iconBg: string; text: string; btn: string }> = {
        blue: { badge: 'bg-blue-900/40 text-blue-300 border border-blue-500/30', iconBg: 'bg-blue-950/60 border border-blue-900/50 group-hover:border-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]', text: 'text-blue-400', btn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-900/30 text-white' },
        indigo: { badge: 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30', iconBg: 'bg-indigo-950/60 border border-indigo-900/50 group-hover:border-indigo-500 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]', text: 'text-indigo-400', btn: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-900/30 text-white' },
        rose: { badge: 'bg-rose-900/40 text-rose-300 border border-rose-500/30', iconBg: 'bg-rose-950/60 border border-rose-900/50 group-hover:border-rose-500 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]', text: 'text-rose-400', btn: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-rose-900/30 text-white' },
        emerald: { badge: 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30', iconBg: 'bg-emerald-950/60 border border-emerald-900/50 group-hover:border-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]', text: 'text-emerald-400', btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/30 text-white' },
        amber: { badge: 'bg-amber-900/40 text-amber-300 border border-amber-500/30', iconBg: 'bg-amber-950/60 border border-amber-900/50 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]', text: 'text-amber-400', btn: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-md shadow-amber-900/30 text-white' },
        purple: { badge: 'bg-purple-900/40 text-purple-300 border border-purple-500/30', iconBg: 'bg-purple-950/60 border border-purple-900/50 group-hover:border-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]', text: 'text-purple-400', btn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-900/30 text-white' },
        slate: { badge: 'bg-slate-800 text-slate-300 border border-slate-700', iconBg: 'bg-slate-900 border border-slate-800 group-hover:border-slate-500 group-hover:shadow-[0_0_15px_rgba(100,116,139,0.3)]', text: 'text-slate-400', btn: 'bg-slate-800 hover:bg-slate-700 text-white' }
      };
      const config = neonColors[color] || neonColors.slate;
      return {
        badge: config.badge,
        iconBg: `${config.iconBg} p-3 rounded-xl transition-all duration-300`,
        iconText: config.text,
        btnClass: `${config.btn} rounded-xl py-2.5 px-4 font-medium transition-all duration-200 hover:-translate-y-0.5`
      };
    }

    // Default: 'minimal-modern' Style
    const baseColors: Record<string, { badge: string; iconBg: string; text: string; btn: string }> = {
      blue: { badge: 'bg-blue-50 text-blue-700 border border-blue-100', iconBg: 'bg-blue-100/60 text-blue-600', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-100' },
      indigo: { badge: 'bg-indigo-50 text-indigo-700 border border-indigo-100', iconBg: 'bg-indigo-100/60 text-indigo-600', text: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-100' },
      rose: { badge: 'bg-rose-50 text-rose-700 border border-rose-100', iconBg: 'bg-rose-100/60 text-rose-600', text: 'text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-100' },
      emerald: { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100', iconBg: 'bg-emerald-100/60 text-emerald-600', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-100' },
      amber: { badge: 'bg-amber-50 text-amber-700 border border-amber-100', iconBg: 'bg-amber-100/60 text-amber-600', text: 'text-amber-600', btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs shadow-amber-100' },
      purple: { badge: 'bg-purple-50 text-purple-700 border border-purple-100', iconBg: 'bg-purple-100/60 text-purple-600', text: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-100' },
      slate: { badge: 'bg-slate-100 text-slate-700 border border-slate-200', iconBg: 'bg-slate-200/60 text-slate-600', text: 'text-slate-600', btn: 'bg-slate-800 hover:bg-slate-900 text-white' }
    };

    const config = baseColors[color] || baseColors.slate;
    return {
      badge: config.badge,
      iconBg: `${config.iconBg} p-3 rounded-2xl transition-colors duration-300`,
      iconText: config.text,
      btnClass: `${config.btn} rounded-xl py-2.5 px-4 font-medium transition-all duration-200 hover:-translate-y-0.5`
    };
  };

  // Convert custom state to actual grid classes
  const getGridClass = () => {
    if (gridCols === '1') return 'grid-cols-1';
    if (gridCols === '2') return 'grid-cols-1 md:grid-cols-2';
    if (gridCols === '3') return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (gridCols === '4') return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    
    // Auto: default responsive behavior (fits 3 normally, fits nicely at all sizes)
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div id="navigation-root-container" className={`min-h-screen pb-16 transition-colors duration-300 ${styleStyles?.bodyClass}`}>
      
      {/* Toast Notice banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium shadow-2xl flex items-center gap-2 border border-slate-800"
          >
            <Sparkle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative colored glow circles (only on dark or fancy themes) */}
      {selectedStyle === 'glassmorphism' && (
        <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>
      )}
      {selectedStyle === 'gradient-glowing' && (
        <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[25%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[25%] w-[25%] h-[25%] bg-purple-600/10 rounded-full blur-[90px]" />
        </div>
      )}

      {/* Top Header Section */}
      <header className="max-w-7xl mx-auto px-4 pt-10 sm:pt-16 pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 sm:p-10 ${styleStyles?.headerCardClass} relative overflow-hidden`}
        >
          {/* Internal card abstract background lines */}
          {selectedStyle === 'minimal-modern' && (
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-slate-50 rounded-full pointer-events-none z-0 mix-blend-multiply" />
          )}

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100/10 text-xs font-semibold rounded-md uppercase tracking-wider backdrop-blur-xs">
                <Languages className="w-3.5 h-3.5" />
                <span>学习导航系统</span>
              </div>
              <h1 id="main-heading" className={`text-3xl sm:text-5xl font-bold tracking-tight ${
                selectedStyle === 'glassmorphism'
                  ? 'bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 italic font-serif py-1'
                  : 'font-extrabold text-slate-900 dark:text-white'
              }`}>
                {selectedStyle === 'neo-brutalist' ? '🌎 语言学习资源导航' : '语言学习资源导航中心'}
              </h1>
              <p className="text-sm sm:text-base leading-relaxed opacity-85">
                精选多语言背词与线上学习网络资源，点选快速直达目标。
                未来支持通过下方的配置面板自由增减导航项、支持任意切换视效选项风格，确保您的扩展布局始终保持精美、规整。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="btn-add-item"
                onClick={() => setModalOpen(true)}
                className={`inline-flex items-center gap-2 py-3 px-5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedStyle === 'neo-brutalist'
                    ? 'bg-amber-300 hover:bg-amber-400 text-black border-2 border-slate-900 shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5'
                    : selectedStyle === 'glassmorphism'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl'
                    : selectedStyle === 'gradient-glowing'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-sm'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>添加新导航</span>
              </button>
              
              <button
                id="btn-restore-defaults"
                title="重置为默认的三个卡片"
                onClick={handleReset}
                className={`p-3 transition-all duration-200 cursor-pointer ${
                  selectedStyle === 'neo-brutalist'
                    ? 'bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[3px_3px_0px_#000]'
                    : selectedStyle === 'glassmorphism'
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-2xl'
                    : selectedStyle === 'gradient-glowing'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs rounded-2xl'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Navigation Controls Bar */}
      <section id="navigation-filters-bar" className="max-w-7xl mx-auto px-4 mb-8 relative z-10">
        <div className={`p-4 sm:p-6 ${
          selectedStyle === 'neo-brutalist'
            ? 'bg-white border-3 border-slate-900 shadow-[4px_4px_0px_#000]'
            : selectedStyle === 'glassmorphism'
            ? 'backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-sm'
            : selectedStyle === 'gradient-glowing'
            ? 'bg-slate-900/60 border border-slate-800/80 rounded-2xl'
            : 'bg-white border border-slate-200/60 shadow-xs rounded-2xl'
        } flex flex-col gap-6`}>
          
          {/* First row: Language Filter Tabs & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter segments */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase opacity-60">显示语言：</span>
              <div className="flex flex-wrap gap-1.5">
                {(['全部', '英语', '法语', '其他'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setFilterLanguage(lang)}
                    className={`px-4 py-1.5 text-xs font-semibold select-none cursor-pointer duration-150 transition-all ${
                      filterLanguage === lang
                        ? selectedStyle === 'neo-brutalist'
                          ? 'bg-slate-900 text-white border border-slate-900 rounded-none'
                          : selectedStyle === 'glassmorphism'
                          ? 'bg-white text-slate-950 font-bold rounded-lg'
                          : 'bg-indigo-600 text-white rounded-lg shadow-xs'
                        : selectedStyle === 'neo-brutalist'
                        ? 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 rounded-none'
                        : selectedStyle === 'glassmorphism'
                        ? 'bg-white/5 text-slate-300 hover:bg-white/10 rounded-lg'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded-lg'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search bar */}
            <div className="relative w-full lg:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search-input"
                type="text"
                placeholder="搜索标题、学习详述或分类性质（如：词汇）..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-hidden transition-all ${
                  selectedStyle === 'neo-brutalist'
                    ? 'bg-white text-slate-900 border-2 border-slate-900 rounded-none focus:bg-amber-50/20'
                    : selectedStyle === 'glassmorphism'
                    ? 'bg-white/5 text-white placeholder-slate-400 border border-white/10 rounded-xl focus:border-white/30 focus:bg-white/10'
                    : selectedStyle === 'gradient-glowing'
                    ? 'bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl focus:border-cyan-500/50'
                    : 'bg-slate-100/70 text-slate-800 placeholder-slate-400 border border-transparent hover:bg-slate-100 rounded-xl focus:bg-white focus:border-slate-300 focus:shadow-xs'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs opacity-60 hover:opacity-100 cursor-pointer"
                >
                  清除
                </button>
              )}
            </div>
          </div>

          <hr className={selectedStyle === 'neo-brutalist' ? 'border-2 border-slate-900' : 'border-slate-200/20'} />

          {/* Second row: Visual options customization switcher & Grid density options */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Nav Styles ( Satisfying "未来扩展更多选项风格" ) */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase opacity-60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>选项风格 (风格主题切换)：</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'minimal-modern', label: '极简现代' },
                  { key: 'glassmorphism', label: '毛玻璃幻彩' },
                  { key: 'neo-brutalist', label: '新粗野主义' },
                  { key: 'gradient-glowing', label: '暗夜霓虹' }
                ].map(styleOpt => (
                  <button
                    key={styleOpt.key}
                    onClick={() => handleStyleChange(styleOpt.key as CardStyle)}
                    className={`px-3.5 py-1.5 text-xs rounded-lg select-none duration-200 transition-all cursor-pointer border ${
                      selectedStyle === styleOpt.key
                        ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-xs'
                        : selectedStyle === 'neo-brutalist'
                        ? 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                        : selectedStyle === 'glassmorphism'
                        ? 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                        : selectedStyle === 'gradient-glowing'
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {styleOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid density selection */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase opacity-60 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>布局列数：</span>
              </span>
              <div className="flex border border-slate-200/20 rounded-lg p-0.5 overflow-hidden font-mono text-xs">
                {[
                  { key: 'auto', label: '自适应' },
                  { key: '1', label: '单列' },
                  { key: '2', label: '双列' },
                  { key: '3', label: '三列' },
                  { key: '4', label: '四列' }
                ].map(gridOpt => (
                  <button
                    key={gridOpt.key}
                    onClick={() => handleColsChange(gridOpt.key as GridCols)}
                    className={`px-3 py-1.5 rounded-md cursor-pointer select-none font-medium transition-all ${
                      gridCols === gridOpt.key
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/20'
                    }`}
                  >
                    {gridOpt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Grid display area */}
      <main className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-16 text-center ${
                selectedStyle === 'neo-brutalist' 
                  ? 'bg-white border-3 border-slate-900 rounded-none shadow-[4px_4px_0px_#000]'
                  : selectedStyle === 'glassmorphism'
                  ? 'bg-white/5 border border-white/10 rounded-3xl'
                  : selectedStyle === 'gradient-glowing'
                  ? 'bg-slate-900/50 border border-slate-800'
                  : 'bg-white border border-slate-100 rounded-3xl shadow-xs'
              }`}
            >
              <div className="inline-flex p-4 rounded-full bg-slate-300/10 mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-lg font-bold">没有匹配的导航结果</p>
              <p className="text-sm opacity-60 max-w-sm mx-auto mt-2">
                未找到包含 &quot;{searchQuery}&quot; 的卡片，您可以尝试更换检索词，或重新点击上方 “重置” 恢复内置学习入口。
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className={`grid ${getGridClass()} gap-6`}
            >
              {filteredItems.map((item, idx) => {
                const colors = getColorClasses(item.colorTheme, selectedStyle);
                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx * 0.05, 0.3) } }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ 
                      y: selectedStyle === 'neo-brutalist' ? 0 : -6,
                      transition: { duration: 0.2 }
                    }}
                    className={styleStyles?.cardClass(item.colorTheme)}
                  >
                    
                    {/* Inner neon border effects for gradient-glowing */}
                    {selectedStyle === 'gradient-glowing' && (
                      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-${item.colorTheme}-400 to-${item.colorTheme}-600 group-hover:w-2.5 transition-all duration-300`} />
                    )}

                    {selectedStyle === 'glassmorphism' ? (
                      /* Centered Frosted Glass Layout Option */
                      <div className="flex flex-col items-center justify-between h-full w-full relative z-10 text-center">
                        
                        {/* Tags and Trash absolute/relative alignment */}
                        <div className="w-full flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 text-slate-300 border border-white/5">
                              {item.language}
                            </span>
                          </div>
                          {!item.isDefault && (
                            <button
                              onClick={(e) => handleDeleteItem(item.id, e)}
                              title="移除此自定义卡片"
                              className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors duration-200 relative z-25 cursor-pointer pointer-events-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Large custom language monogram block */}
                        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 mb-6 ${
                          item.language === '英语'
                            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/25'
                            : item.language === '法语' && item.id === 'french-vocab'
                            ? 'bg-gradient-to-br from-blue-500 via-white to-red-500 shadow-blue-500/25 font-serif'
                            : item.id === 'lumni-french'
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/25'
                            : `bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 shadow-purple-500/25`
                        }`}>
                          {item.language === '英语' ? (
                            <span className="text-4xl font-extrabold text-white tracking-widest font-serif italic select-none">EN</span>
                          ) : item.language === '法语' && item.id === 'french-vocab' ? (
                            <span className="text-4xl font-extrabold text-slate-900 tracking-widest font-serif italic select-none">FR</span>
                          ) : item.id === 'lumni-french' ? (
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          ) : (
                            <span className="text-4xl font-extrabold text-white tracking-widest font-serif uppercase select-none inline-flex items-center justify-center">
                              {item.title ? item.title.slice(0, 2) : 'ID'}
                            </span>
                          )}
                        </div>

                        {/* Title and category details */}
                        <div className="space-y-1 mb-3">
                          <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors duration-200">
                            {item.title}
                          </h3>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md bg-white/10 border border-white/5 text-slate-300">
                            {item.category}
                          </span>
                        </div>

                        {/* Description block (centered and spaced out) */}
                        <p className="text-sm leading-relaxed text-slate-300 max-w-xs min-h-[4rem] px-2 mb-6">
                          {item.description}
                        </p>

                        {/* Action link style (the pill button on bottom) */}
                        <div className="w-full pt-4 mt-auto border-t border-white/5 flex flex-col items-center">
                          <div className="w-full py-3 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase border border-white/5 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all duration-300 inline-flex items-center justify-center gap-2 text-white">
                            <span>立即访问</span>
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Standard Theme Layout Options */
                      <>
                        {/* Card Content Top area */}
                        <div className="space-y-4">
                          
                          {/* Badge Tags & Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={colors.badge}>
                                {item.language}
                              </span>
                              <span className={`${styleStyles?.badgeClass} ${styleStyles?.tagColor}`}>
                                {item.category}
                              </span>
                            </div>

                            {/* Direct removal button for Custom items */}
                            {!item.isDefault && (
                              <button
                                onClick={(e) => handleDeleteItem(item.id, e)}
                                title="移除此自定义卡片"
                                className="p-1 px-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors duration-200 relative z-10 cursor-pointer pointer-events-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Icon + Heading Header inline */}
                          <div className="flex items-start gap-4 pt-2">
                            <div className={colors.iconBg}>
                              <IconComponent name={item.iconName} className={`${colors.iconText} w-6 h-6`} />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold tracking-tight group-hover:text-amber-500 transition-colors duration-200 dark:text-white text-slate-900">
                                {item.title}
                              </h3>
                              <p className="text-xs font-mono opacity-40 group-hover:opacity-80 transition-opacity duration-200 break-all truncate max-w-[200px] sm:max-w-[240px]">
                                {item.url.replace(/^https?:\/\//i, '')}
                              </p>
                            </div>
                          </div>

                          {/* Main explanation body */}
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 min-h-[4.5rem]">
                            {item.description}
                          </p>

                        </div>

                        {/* Card Action Link Bottom area */}
                        <div className="pt-6 mt-4 border-t border-slate-200/20 relative z-10 flex items-center justify-between">
                          <span className="text-xs font-semibold opacity-50 flex items-center gap-1">
                            点击卡片直达该站
                          </span>
                          
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 group-hover:translate-x-1 duration-200 relative z-10 ${colors.btnClass}`}
                          >
                            <span className="text-xs font-bold leading-none">
                              立即访问
                            </span>
                            {selectedStyle === 'neo-brutalist' ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </a>
                        </div>
                      </>
                    )}

                    {/* Transparent Click Anchor wrap over entire card area for natural portal click flow */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10 cursor-pointer pointer-events-auto"
                      aria-label={`访问 ${item.title}`}
                    />

                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Feature / Future Readiness Documentation Block ( Satisfying "未来我可能会增加更多选项风格" ) */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 relative z-10">
        <div className={`p-6 sm:p-8 ${
          selectedStyle === 'neo-brutalist'
            ? 'bg-white border-3 border-slate-900 rounded-none shadow-[4px_4px_0px_#000]'
            : selectedStyle === 'glassmorphism'
            ? 'backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl text-slate-300'
            : selectedStyle === 'gradient-glowing'
            ? 'bg-slate-900/40 border border-slate-800 rounded-3xl'
            : 'bg-slate-100 border border-slate-200/50 rounded-3xl'
        } grid grid-cols-1 md:grid-cols-3 gap-6`}>
          <div className="space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-500" />
              <span>自适应响应式网格</span>
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              网格卡片布局自动适配移动端、平板及超宽显示器。您可以新增至 10+ 导航项目，通过灵活的多列数选择器，任何状态均整洁美观。
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>风格与交互包容性</span>
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              预置了经典的 4 大类纯前端卡片风格框架。不管您未来想要偏向数字科技冷酷风、雅致玻璃拟态，或是波普新粗野主义，皆已内建支持。
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              <span>代码扩展友好</span>
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              通过单独的 <code>/src/data.ts</code> 定义基础配置。您可以在未来通过编辑静态列表直接为网站永久置入内置精选卡片。
            </p>
          </div>
        </div>
      </footer>

      {/* Add New Card Dialog (Popup Modal) */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop line overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`w-full max-w-lg p-6 sm:p-8 relative z-10 overflow-hidden ${
                selectedStyle === 'neo-brutalist'
                  ? 'bg-white border-4 border-slate-900 rounded-none shadow-[8px_8px_0px_#000]'
                  : 'bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  <span>添加自定义导航卡片</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors duration-150 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddCard} className="space-y-4">
                
                {/* Title and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">卡片标题 *</label>
                    <input
                      type="text"
                      placeholder="例：法语背单词高级库"
                      value={newCard.title}
                      onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">主要分组/类型 *</label>
                    <input
                      type="text"
                      placeholder="例：词汇背诵、综合听力"
                      value={newCard.category}
                      onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* Target Language */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">目标语种类型</label>
                  <div className="flex gap-2">
                    {(['英语', '法语', '其他'] as const).map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setNewCard(prev => ({ ...prev, language: lang }))}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          newCard.language === lang
                            ? 'bg-slate-900 border-slate-950 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Site URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">网站链接端口 (URL) *</label>
                  <input
                    type="text"
                    placeholder="请输入：https://example.com"
                    value={newCard.url}
                    onChange={(e) => setNewCard(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-hidden font-mono"
                    required
                  />
                </div>

                {/* Short descriptive */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">平台简介与特色功能 *</label>
                  <textarea
                    rows={2}
                    maxLength={130}
                    placeholder="请使用简短一两句话向自己介绍该网站的卓越功能（例如：提供海量拼写及发音测试，非常优质）。"
                    value={newCard.description}
                    onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-hidden"
                    required
                  />
                </div>

                {/* Theme colors selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">设定高亮颜色主题</label>
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {THEME_COLORS.map(col => (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() => setNewCard(prev => ({ ...prev, colorTheme: col.key as any }))}
                        className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${col.bg.split(' ')[0]} ${
                          newCard.colorTheme === col.key ? 'border-slate-800 scale-110 shadow-xs' : 'border-transparent hover:scale-105'
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">选择契合的矢量图标</label>
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {AVAILABLE_ICONS.map(i => (
                      <button
                        key={i.name}
                        type="button"
                        onClick={() => setNewCard(prev => ({ ...prev, iconName: i.name }))}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          newCard.iconName === i.name
                            ? 'bg-slate-900 border-slate-950 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        <IconComponent name={i.name} className="w-4 h-4" />
                        <span className="text-[10px] truncate max-w-full font-sans scale-90">{i.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors duration-150 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors duration-150 cursor-pointer"
                  >
                    确定添加
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
