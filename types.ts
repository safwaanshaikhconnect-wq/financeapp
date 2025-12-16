export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum Category {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  BILLS = 'Bills',
  EDUCATION = 'Education',
  SALARY = 'Salary',
  ALLOWANCE = 'Allowance',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string; // Changed to string to allow custom input
  note: string;
  date: string; // ISO string
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: { name: string; avatar: string; score: number }[];
  userScore: number;
  target: number;
  unit: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export type AppView = 'dashboard' | 'transactions' | 'goals' | 'social' | 'ai-advisor';