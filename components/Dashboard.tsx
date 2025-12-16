import React, { useMemo } from 'react';
import { Transaction, TransactionType, Goal } from '../types';
import { Eye, EyeOff, TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
  privateMode: boolean;
  togglePrivateMode: () => void;
}

// Updated "Cyber-Tropical" Palette for Charts
const COLORS = ['#06b6d4', '#ec4899', '#84cc16', '#f97316', '#a855f7', '#fb7185'];

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, privateMode, togglePrivateMode }) => {
  
  const calculateTotal = (type: TransactionType) => {
    return transactions
      .filter((t) => t.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const income = calculateTotal(TransactionType.INCOME);
  const expense = calculateTotal(TransactionType.EXPENSE);
  const balance = income - expense;

  const formatCurrency = (amount: number) => {
    if (privateMode) return '₹ ••••';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const catMap: Record<string, number> = {};
    expenses.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    return Object.keys(catMap).map(key => ({ name: key, value: catMap[key] }));
  }, [transactions]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header / Balance Card - New "Sunset" Gradient */}
      <div className="bg-gradient-to-br from-pink-600 to-orange-500 p-6 rounded-3xl shadow-lg shadow-pink-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-pink-100 text-sm font-medium tracking-wide">TOTAL BALANCE</p>
              <h1 className="text-4xl font-bold mt-1 tracking-tight">{formatCurrency(balance)}</h1>
            </div>
            <button onClick={togglePrivateMode} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md">
              {privateMode ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="bg-white/10 p-3 rounded-2xl flex-1 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 text-lime-300 mb-1">
                <div className="bg-lime-400/20 p-1 rounded-full">
                  <TrendingUp size={14} />
                </div>
                <span className="text-xs font-bold uppercase">Income</span>
              </div>
              <p className="text-lg font-bold text-white">{formatCurrency(income)}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl flex-1 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 text-rose-200 mb-1">
                <div className="bg-rose-400/20 p-1 rounded-full">
                  <TrendingDown size={14} />
                </div>
                <span className="text-xs font-bold uppercase">Expense</span>
              </div>
              <p className="text-lg font-bold text-white">{formatCurrency(expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Snippet */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-lg font-bold text-white tracking-wide">Top Goals</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {goals.length > 0 ? goals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="bg-card p-4 rounded-2xl min-w-[160px] border border-white/5 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div className="text-2xl">{goal.icon}</div>
                <div className="text-xs text-gray-400 font-mono font-bold">
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </div>
              </div>
              <h3 className="font-bold text-white text-sm truncate">{goal.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {privateMode ? '₹•••' : `₹${goal.currentAmount}`} / {privateMode ? '₹•••' : `₹${goal.targetAmount}`}
              </p>
              <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                  style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`, backgroundColor: goal.color }}
                />
              </div>
            </div>
          )) : (
            <div className="bg-card p-4 rounded-2xl w-full border border-white/5 text-center py-8 text-gray-400">
              <Target className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No goals yet. Set one!</p>
            </div>
          )}
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="bg-card p-5 rounded-3xl border border-white/5 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4 tracking-wide">Spending Breakdown</h2>
        <div className="h-[200px] w-full relative">
           {categoryData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={categoryData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    formatter={(value: number) => privateMode ? '***' : `₹${value}`}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                 />
               </PieChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex items-center justify-center h-full text-gray-500 text-sm">
               No expense data available
             </div>
           )}
           {/* Center Text */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xs text-gray-400 font-medium uppercase">Total</p>
              <p className="text-xl font-bold text-white">{formatCurrency(expense)}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;