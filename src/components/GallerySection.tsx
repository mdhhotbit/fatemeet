import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Sparkles } from 'lucide-react';
import { PERSONALITIES, CATEGORIES } from '../data/personalities';
import { Personality, PersonalityCategory } from '../types';
import { PortraitImage } from './PortraitImage';
import { getInitials } from '../lib/utils';
import { PersonalityDetailModal } from './PersonalityDetailModal';
import { recordProfileView } from '../lib/anonymousAnalytics';

export const GallerySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PersonalityCategory | 'All'>('All');
  const [activeModalPersonality, setActiveModalPersonality] = useState<Personality | null>(null);

  const handleOpenDossier = (personality: Personality) => {
    recordProfileView(personality.id);
    setActiveModalPersonality(personality);
  };

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/30 text-xs font-mono text-blue-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Complete Archive</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          THE 50 LIVES
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Freely explore all fifty famous historical personalities. Search by name, nationality, or domain of achievement.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 mb-10">
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <input
            type="text"
            placeholder="Search by name, profession, or nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#060C1E]/80 border border-white/10 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs (Base segmented controls) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#060C1E] border border-white/[0.08] rounded-2xl max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 max-w-7xl mx-auto font-mono">
          <span>
            Displaying <strong className="text-white">{filteredPersonalities.length}</strong> of{' '}
            {PERSONALITIES.length} personalities
          </span>
          {searchQuery && (
            <span>
              Matching: "<span className="text-blue-300">{searchQuery}</span>"
            </span>
          )}
        </div>
      </div>

      {/* Grid of Personalities (Base rounded-2xl cards) */}
      {filteredPersonalities.length === 0 ? (
        <div className="text-center py-16 bg-[#060C1E]/50 border border-white/10 rounded-3xl">
          <p className="font-sans-clean text-slate-400 text-base mb-3">
            No historical personalities match your query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-[#38BDF8] hover:underline font-semibold"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredPersonalities.map((personality) => (
            <div
              key={personality.id}
              onClick={() => handleOpenDossier(personality)}
              className="group relative bg-[#060C1E] border border-white/[0.08] hover:border-[#0052FF]/60 hover:shadow-2xl hover:shadow-[#0052FF]/15 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Portrait container */}
              <div className="relative overflow-hidden aspect-[4/4]">
                <PortraitImage
                  src={personality.portraitUrl}
                  alt={personality.name}
                  initials={getInitials(personality.name)}
                  aspectRatio="square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060C1E] via-transparent to-transparent opacity-80" />

                {/* ID badge overlay */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300">
                  #{personality.id}
                </div>
              </div>

              {/* Card info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Category chip */}
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-medium mb-1">
                    <span className="line-clamp-1">{personality.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{personality.nationality}</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                    {personality.name}
                  </h3>

                  {/* Profession */}
                  <p className="font-sans-clean text-xs text-slate-300 mt-0.5 line-clamp-1">
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
                <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-[11px] font-semibold tracking-wide">View Dossier</span>
                  <BookOpen className="w-3.5 h-3.5 text-[#0052FF] group-hover:translate-x-0.5 transition-transform" />
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
