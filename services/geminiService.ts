import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  goals: Goal[],
  query: string
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please set the process.env.API_KEY.";
  }

  // Summarize data for the context
  const recentTransactions = transactions.slice(0, 20);
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const goalsSummary = goals.map(g => `${g.title}: ₹${g.currentAmount}/₹${g.targetAmount}`).join(', ');

  const context = `
    You are a friendly, cool, and savvy financial advisor for a Gen Z student in India. 
    The user's current financial snapshot:
    - Total Income (Recent): ₹${incomeTotal}
    - Total Expense (Recent): ₹${expenseTotal}
    - Active Goals: ${goalsSummary || 'None'}
    - Recent Transactions: ${JSON.stringify(recentTransactions.map(t => ({ cat: t.category, amt: t.amount, note: t.note })))}
    
    Currency is Indian Rupee (₹).
    Keep advice short, actionable, and encouraging. Use emojis.
    If the user asks a question, answer it based on this data.
    If the user asks for a general tip, look at their spending habits and suggest something specific (e.g., "You spent a lot on food, maybe cook more?").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${context}\n\nUser Question: ${query}`,
      config: {
        systemInstruction: "You are a helpful financial assistant for young adults.",
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate advice right now. Try again later!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the financial brain right now.";
  }
};
