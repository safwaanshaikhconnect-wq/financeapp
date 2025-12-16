import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { Plus, ArrowDownLeft, ArrowUpRight, X, Tag, IndianRupee } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, addTransaction, deleteTransaction }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  
  const [category, setCategory] = useState<string>(Category.FOOD);
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const finalCategory = category === 'Other' && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    addTransaction({
      amount: parseFloat(amount),
      type,
      category: finalCategory,
      note,
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount('');
    setNote('');
    setCustomCategory('');
    setCategory(Category.FOOD);
    setIsAdding(false);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const DISPLAY_CATEGORIES = [
    Category.FOOD,
    Category.TRANSPORT,
    Category.SHOPPING,
    Category.ENTERTAINMENT,
    Category.BILLS
  ];

  return (
    <div className="pb-24 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide">History</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-cyan-400 text-dark font-bold p-3 rounded-2xl transition shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {sortedTransactions.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>No transactions yet.</p>
            <p className="text-sm mt-2">Tap + to add one.</p>
          </div>
        )}
        {sortedTransactions.map((t) => (
          <div key={t.id} className="bg-card p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/10 transition">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${t.type === TransactionType.INCOME ? 'bg-lime-500/10 text-lime-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {t.type === TransactionType.INCOME ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <p className="font-bold text-white">{t.category}</p>
                <p className="text-xs text-gray-400">{t.note || new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-lime-400' : 'text-rose-400'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} ₹{t.amount}
              </p>
              <button onClick={() => deleteTransaction(t.id)} className="text-[10px] uppercase font-bold tracking-wider text-gray-600 hover:text-rose-400 mt-1">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Transaction Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up border-t border-white/10 sm:border-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">New Transaction</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="relative">
                <label className="block text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-700 transition"
                    placeholder="0"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Type Toggle */}
              <div className="flex bg-dark p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${type === TransactionType.EXPENSE ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${type === TransactionType.INCOME ? 'bg-lime-500 text-dark shadow-lg shadow-lime-500/20' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Income
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Tag size={12} /> Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DISPLAY_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${category === cat ? 'bg-primary border-primary text-dark' : 'bg-dark border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                      type="button"
                      onClick={() => setCategory('Other')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${category === 'Other' ? 'bg-primary border-primary text-dark' : 'bg-dark border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      Other
                  </button>
                </div>
                {category === 'Other' && (
                  <div className="mt-2 animate-fade-in">
                     <input 
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Name your category..."
                        className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary text-sm placeholder-gray-600 font-medium"
                     />
                  </div>
                )}
              </div>

              {/* Note */}
              <div>
                 <label className="block text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Note (Optional)</label>
                 <input 
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Lunch with Rahul"
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary text-sm font-medium"
                 />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-cyan-400 text-dark font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/25 transition active:scale-[0.98]"
              >
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;