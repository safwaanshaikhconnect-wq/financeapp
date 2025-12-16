import React, { useState } from 'react';
import { Goal } from '../types';
import { Plus, Target, Rocket, Laptop, Plane, X, Sparkles } from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id'>) => void;
  updateGoalAmount: (id: string, amount: number) => void;
}

const ICONS = ['🚀', '💻', '✈️', '🎓', '🎸', '🏠', '🚗', '📱'];
// Updated Neon/Tropical Colors
const COLORS = ['#06b6d4', '#ec4899', '#84cc16', '#f97316', '#d946ef'];

const Goals: React.FC<GoalsProps> = ({ goals, addGoal, updateGoalAmount }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      title,
      targetAmount: parseFloat(target),
      currentAmount: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Default 90 days
      icon: selectedIcon,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    setIsAdding(false);
    setTitle('');
    setTarget('');
  };

  return (
    <div className="pb-24 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Your Goals</h2>
          <p className="text-gray-400 text-sm">Save up for what matters.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-cyan-400 text-dark font-bold p-3 rounded-2xl transition shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
        {goals.length === 0 && (
           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <Sparkles size={48} className="mb-4 text-gray-600" />
             <p>Dream big. Start small.</p>
             <p className="text-sm">Create your first goal.</p>
           </div>
        )}

        {goals.map((goal) => {
          const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <div key={goal.id} className="bg-card p-5 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: goal.color }}></div>
              
              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-dark p-2 rounded-2xl border border-white/5 shadow-inner">{goal.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">{goal.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">Target: ₹{goal.targetAmount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{Math.round(percent)}%</span>
                </div>
              </div>

              <div className="pl-3">
                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-700 ease-out relative shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                    style={{ width: `${percent}%`, backgroundColor: goal.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm font-medium">
                  <span className="text-gray-400">Saved: <span className="text-white">₹{goal.currentAmount}</span></span>
                  <span className="text-gray-500 text-xs">Due {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                   <button 
                     onClick={() => updateGoalAmount(goal.id, 500)}
                     className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold py-3 rounded-xl transition"
                   >
                     + ₹500
                   </button>
                   <button 
                     onClick={() => updateGoalAmount(goal.id, 1000)}
                     className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold py-3 rounded-xl transition"
                   >
                     + ₹1k
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up border-t border-white/10 sm:border-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Create Goal</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-bold uppercase">Goal Name</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Laptop" 
                  className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-bold uppercase">Target Amount (₹)</label>
                <input 
                  type="number" 
                  value={target} 
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="50000" 
                  className="w-full bg-dark border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none font-bold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-bold uppercase">Choose Icon</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`min-w-[48px] h-12 rounded-xl flex items-center justify-center text-xl border transition-all ${selectedIcon === icon ? 'bg-primary border-primary text-dark' : 'bg-dark border-white/10 hover:bg-white/5'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-cyan-400 text-dark font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/25 transition"
              >
                Start Saving
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;