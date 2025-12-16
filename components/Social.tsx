import React from 'react';
import { Challenge, Badge } from '../types';
import { Trophy, Users, Award, Lock, Shield } from 'lucide-react';

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'No Eat-Out Week',
    description: 'Spend less than ₹500 on outside food this week.',
    participants: [
      { name: 'You', avatar: 'https://picsum.photos/40/40?random=1', score: 120 },
      { name: 'Priya', avatar: 'https://picsum.photos/40/40?random=2', score: 450 },
      { name: 'Arjun', avatar: 'https://picsum.photos/40/40?random=3', score: 800 },
    ],
    userScore: 120,
    target: 500,
    unit: '₹',
  },
  {
    id: '2',
    title: '₹5k Saving Sprint',
    description: 'Who can save ₹5,000 fastest this month?',
    participants: [
      { name: 'Arjun', avatar: 'https://picsum.photos/40/40?random=3', score: 4200 },
      { name: 'You', avatar: 'https://picsum.photos/40/40?random=1', score: 3100 },
      { name: 'Rohan', avatar: 'https://picsum.photos/40/40?random=4', score: 2000 },
    ],
    userScore: 3100,
    target: 5000,
    unit: '₹',
  }
];

const BADGES: Badge[] = [
  { id: '1', name: 'Saver Starter', icon: '🌱', unlocked: true, description: 'Created your first goal' },
  { id: '2', name: 'Streak Master', icon: '🔥', unlocked: true, description: 'Tracked expenses for 7 days' },
  { id: '3', name: 'Miser Mode', icon: '🛡️', unlocked: false, description: 'Spend 0 on entertainment for a week' },
  { id: '4', name: 'Big Baller', icon: '💎', unlocked: false, description: 'Save ₹1 Lakh total' },
];

const Social: React.FC = () => {
  return (
    <div className="pb-24 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-white">Circles</h2>
           <p className="text-gray-400 text-sm">Compete with friends.</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-yellow-500 text-xs font-bold">
          <Trophy size={14} /> Rank #2
        </div>
      </div>

      {/* Challenges Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Users size={18} className="text-primary" /> Active Challenges
        </h3>
        <div className="space-y-4">
          {MOCK_CHALLENGES.map((c) => (
            <div key={c.id} className="bg-card p-5 rounded-3xl border border-white/5">
              <div className="flex justify-between mb-2">
                <h4 className="font-bold text-white">{c.title}</h4>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">3 days left</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{c.description}</p>
              
              {/* Leaderboard Mini */}
              <div className="space-y-3">
                {c.participants.sort((a,b) => a.score - b.score).map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono w-4 ${idx === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>#{idx + 1}</span>
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border border-white/10" />
                      <span className={`text-sm ${p.name === 'You' ? 'text-primary font-bold' : 'text-gray-300'}`}>{p.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{c.unit}{p.score}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                 <button className="text-xs text-primary font-semibold hover:text-violet-300">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Award size={18} className="text-secondary" /> Badges
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-4 rounded-2xl border ${badge.unlocked ? 'bg-card border-white/10' : 'bg-dark border-white/5 opacity-60'} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl grayscale-0">{badge.icon}</span>
                {!badge.unlocked && <Lock size={14} className="text-gray-500" />}
              </div>
              <h4 className="font-bold text-sm text-white">{badge.name}</h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Social;
