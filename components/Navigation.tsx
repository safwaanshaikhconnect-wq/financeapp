import React from 'react';
import { LayoutDashboard, ListOrdered, Target, Users, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems: { view: AppView; icon: React.ReactNode; label: string }[] = [
    { view: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
    { view: 'transactions', icon: <ListOrdered size={20} />, label: 'History' },
    { view: 'ai-advisor', icon: <Sparkles size={24} />, label: 'Ask AI' }, // Center Prominent
    { view: 'goals', icon: <Target size={20} />, label: 'Goals' },
    { view: 'social', icon: <Users size={20} />, label: 'Circles' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card/90 backdrop-blur-xl border-t border-white/5 pb-safe pt-2 px-4 z-40 max-w-[500px] mx-auto right-0">
      <div className="flex justify-around items-end pb-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const isCenter = item.view === 'ai-advisor';

          if (isCenter) {
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`relative -top-6 flex flex-col items-center justify-center group`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all duration-300 active:scale-95 group-hover:shadow-cyan-500/50 ${isActive ? 'bg-gradient-to-tr from-cyan-400 to-teal-500 text-white border-4 border-dark' : 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white'}`}>
                   {item.icon}
                </div>
                <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center justify-center p-2 w-16 transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <div className={`transition-transform duration-200 ${isActive ? '-translate-y-1' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-primary opacity-100' : 'opacity-0'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;