import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface ModernSelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'red' | 'blue' | 'purple' | 'teal';
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ModernSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: ModernSelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  themeMode?: 'forest' | 'fixora';
  variant?: 'default' | 'accent' | 'danger';
  size?: 'sm' | 'md';
  id?: string;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Sélectionner une option...',
  icon,
  disabled = false,
  searchable = false,
  className = '',
  themeMode = 'fixora',
  variant = 'default',
  size = 'md',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isFixora = themeMode === 'fixora';

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter options based on search query
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (opt.badge && opt.badge.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getBadgeStyle = (color?: ModernSelectOption['badgeColor']) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-950 border border-red-300 font-bold';
      case 'amber':
        return 'bg-amber-100 text-amber-950 border border-amber-300 font-bold';
      case 'blue':
      case 'teal':
        return 'bg-teal-100 text-teal-950 border border-teal-300 font-bold';
      case 'purple':
        return 'bg-purple-100 text-purple-950 border border-purple-300 font-bold';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-900 border border-slate-300 font-bold';
    }
  };

  // Variant styling for trigger button
  const getTriggerStyles = () => {
    if (variant === 'danger') {
      return `border-red-400 bg-red-50 text-red-950 hover:border-red-600 shadow-xs ${
        isOpen ? 'ring-2 ring-red-400 border-red-600' : ''
      }`;
    }
    if (variant === 'accent') {
      return `border-teal-400 bg-teal-50 text-teal-950 hover:border-teal-600 shadow-xs ${
        isOpen ? 'ring-2 ring-teal-400 border-teal-600' : ''
      }`;
    }
    return `bg-white border-slate-300 hover:border-teal-600 text-slate-950 shadow-xs ${
      isOpen ? 'ring-2 ring-teal-600/40 border-teal-600' : ''
    }`;
  };

  const getDropdownMenuStyles = () => {
    return 'bg-white border-slate-300 text-slate-950 shadow-xl';
  };

  return (
    <div className={`relative w-full text-left ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-xs font-bold text-slate-900 mb-1.5 tracking-tight whitespace-nowrap">
          {label}
        </label>
      )}

      {/* Main Trigger Button (min 44px for Apple HIG touch targets) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[42px] flex items-center justify-between rounded-xl border transition-all duration-150 select-none ${
          size === 'sm' ? 'px-3 py-2 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
        } ${getTriggerStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 flex-1">
          {icon && <span className="text-teal-600 shrink-0">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-1.5 truncate">
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="truncate font-semibold text-slate-950">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap tracking-tight ${getBadgeStyle(
                    selectedOption.badgeColor
                  )}`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 font-normal truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 pl-1.5 shrink-0 text-slate-500">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-700' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Menu Modal / Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${getDropdownMenuStyles()}`}
          style={{ maxHeight: '280px' }}
        >
          {/* Search bar */}
          {searchable && (
            <div className="p-2 border-b border-slate-200 bg-slate-50">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-2.5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un site ou secteur..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 no-scrollbar bg-white">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500 font-medium">
                Aucun résultat trouvé
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs ${
                      isSelected
                        ? 'bg-teal-50 text-teal-950 font-bold border border-teal-300'
                        : 'hover:bg-slate-100 text-slate-900 font-normal'
                    } ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex flex-col min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <span className="truncate whitespace-nowrap font-medium text-slate-950">{option.label}</span>
                        {option.badge && (
                          <span
                            className={`text-[9.5px] px-1.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap tracking-tight ${getBadgeStyle(
                              option.badgeColor
                            )}`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <span className="text-[10.5px] text-slate-600 font-normal truncate mt-0.5">
                          {option.subtitle}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-teal-700 shrink-0 font-bold ml-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
