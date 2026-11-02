import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import { PERSONALITIES, CATEGORIES } from '../data/personalities';
import { Personality, PersonalityCategory } from '../types';
import { PortraitImage } from './PortraitImage';
import { getInitials } from '../lib/utils';
import { PersonalityDetailModal } from './PersonalityDetailModal';

export const GallerySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PersonalityCategory | 'All'>('All');
  const [activeModalPersonality, setActiveModalPersonality] = useState<Personality | null>(null);

  const filteredPersonalities = useMemo(() => {
    return PERSONALITIES.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.biography.toLowerCase().includes(q) ||
        p.majorAchievements.some((a) => a.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <p className="font-editorial text-amber-300 text-sm tracking-widest uppercase mb-2">
          The Historical Pantheon
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          THE 50 LIVES
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Explore the exact fifty personalities present within FATE MEET. Browse their dossiers, achievements, and legacies at no cost.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 mb-10">
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, profession, or nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs (Segmented controls) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-950/80 border border-white/5 rounded-xl max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            All Lives (50)
          </button>

          {CATEGORIES.map((cat) => {
            const count = PERSONALITIES.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 max-w-7xl mx-auto">
          <span>
            Showing <strong className="text-amber-200">{filteredPersonalities.length}</strong> of{' '}
            {PERSONALITIES.length} personalities
          </span>
          {searchQuery && (
            <span>
              Filtered by: "<span className="text-slate-200">{searchQuery}</span>"
            </span>
          )}
        </div>
      </div>

      {/* Grid of Personalities */}
      {filteredPersonalities.length === 0 ? (
        <div className="text-center py-16 bg-slate-950/40 border border-white/5 rounded-2xl">
          <p className="font-editorial italic text-slate-400 text-lg mb-3">
            No historical personalities match your query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-amber-300 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPersonalities.map((personality) => (
            <div
              key={personality.id}
              onClick={() => setActiveModalPersonality(personality)}
              className="group relative bg-[#090e1c] border border-white/10 hover:border-amber-400/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col"
            >
              {/* Portrait container */}
              <div className="relative overflow-hidden">
                <PortraitImage
                  src={personality.portraitUrl}
                  alt={personality.name}
                  initials={getInitials(personality.name)}
                  aspectRatio="portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c] via-transparent to-transparent opacity-80" />

                {/* ID badge overlay */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300">
                  #{personality.id}
                </div>
              </div>

              {/* Card info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Unboxed metadata */}
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 mb-1">
                    <span>{personality.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{personality.nationality}</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {personality.name}
                  </h3>

                  {/* Profession */}
                  <p className="font-editorial italic text-xs text-slate-300 mt-0.5 line-clamp-1">
                    {personality.profession}
                  </p>

                  {/* Lifetime */}
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    {personality.birthDate.split(',').pop()?.trim()}
                    {personality.deathDate
                      ? ` — ${personality.deathDate.split(',').pop()?.trim()}`
                      : ' — Present'}
                  </p>
                </div>

                {/* Action hint */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-300 transition-colors">
                  <span className="text-[11px] uppercase tracking-wider font-medium">Read Dossier</span>
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Dossier Modal */}
      <PersonalityDetailModal
        personality={activeModalPersonality}
        onClose={() => setActiveModalPersonality(null)}
      />
    </section>
  );
};
