import React, { useState, useEffect } from 'react';
import { Transaction, Goal, AppView, TransactionType, Category } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Goals from './components/Goals';
import Social from './components/Social';
import AIAdvisor from './components/AIAdvisor';

// Mock Initial Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 150, type: TransactionType.EXPENSE, category: Category.FOOD, note: 'Burger King', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', amount: 2500, type: TransactionType.INCOME, category: Category.ALLOWANCE, note: 'Dad sent money', date: new Date(Date.now() - 172800000).toISOString() },
  { id: '3', amount: 450, type: TransactionType.EXPENSE, category: Category.TRANSPORT, note: 'Uber to college', date: new Date(Date.now() - 200000000).toISOString() },
  { id: '4', amount: 1200, type: TransactionType.EXPENSE, category: Category.SHOPPING, note: 'Myntra Sale', date: new Date(Date.now() - 5000000).toISOString() },
];

const INITIAL_GOALS: Goal[] = [
  { id: '1', title: 'Goa Trip', targetAmount: 15000, currentAmount: 4500, deadline: new Date(Date.now() + 5000000000).toISOString(), icon: '🏖️', color: '#f97316' }, // Orange
  { id: '2', title: 'Gaming PC', targetAmount: 80000, currentAmount: 12000, deadline: new Date(Date.now() + 9000000000).toISOString(), icon: '💻', color: '#06b6d4' }, // Cyan
];

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });
  const [privateMode, setPrivateMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Date.now().toString() };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addGoal = (g: Omit<Goal, 'id'>) => {
    const newGoal = { ...g, id: Date.now().toString() };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals((prev) => prev.map(g => {
      if (g.id === id) {
        // Prevent going over target or under 0 purely for UI niceness
        const newAmount = Math.min(g.targetAmount, Math.max(0, g.currentAmount + amount));
        return { ...g, currentAmount: newAmount };
      }
      return g;
    }));
  };

  const togglePrivateMode = () => setPrivateMode(!privateMode);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions} 
            goals={goals} 
            privateMode={privateMode} 
            togglePrivateMode={togglePrivateMode} 
          />
        );
      case 'transactions':
        return (
          <Transactions 
            transactions={transactions} 
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
          />
        );
      case 'goals':
        return (
          <Goals 
            goals={goals} 
            addGoal={addGoal} 
            updateGoalAmount={updateGoalAmount} 
          />
        );
      case 'social':
        return <Social />;
      case 'ai-advisor':
        return <AIAdvisor transactions={transactions} goals={goals} />;
      default:
        return <Dashboard transactions={transactions} goals={goals} privateMode={privateMode} togglePrivateMode={togglePrivateMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-50 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-[500px] min-h-screen bg-dark relative shadow-2xl overflow-hidden">
        
        {/* Main Content Area */}
        <main className="p-4 h-full overflow-y-auto no-scrollbar">
           {/* Top Spacing for status bar aesthetics */}
           <div className="h-2 mb-2"></div>
           {renderView()}
        </main>

        {/* Navigation */}
        <Navigation currentView={currentView} setView={setView} />
      </div>
    </div>
  );
};

export default App;