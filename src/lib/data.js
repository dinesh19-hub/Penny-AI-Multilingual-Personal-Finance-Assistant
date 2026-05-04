// Mock data store - simulates a database
let transactions = [
  { id: 1, description: 'Spotify Premium', category: 'entertainment', amount: -9.99, date: '2026-05-03', type: 'expense', icon: '🎵' },
  { id: 2, description: 'Salary - May', category: 'salary', amount: 5200.00, date: '2026-05-01', type: 'income', icon: '💼' },
  { id: 3, description: 'Whole Foods Market', category: 'food', amount: -78.45, date: '2026-05-02', type: 'expense', icon: '🛒' },
  { id: 4, description: 'Uber Ride', category: 'transport', amount: -14.20, date: '2026-05-02', type: 'expense', icon: '🚗' },
  { id: 5, description: 'Netflix', category: 'entertainment', amount: -15.99, date: '2026-05-01', type: 'expense', icon: '🎬' },
  { id: 6, description: 'Freelance Project', category: 'freelance', amount: 1200.00, date: '2026-04-30', type: 'income', icon: '💻' },
  { id: 7, description: 'Electric Bill', category: 'utilities', amount: -120.50, date: '2026-04-29', type: 'expense', icon: '⚡' },
  { id: 8, description: 'H&M Shopping', category: 'shopping', amount: -89.00, date: '2026-04-28', type: 'expense', icon: '👗' },
  { id: 9, description: 'Gym Membership', category: 'health', amount: -45.00, date: '2026-04-27', type: 'expense', icon: '💪' },
  { id: 10, description: 'Amazon Purchase', category: 'shopping', amount: -134.99, date: '2026-04-26', type: 'expense', icon: '📦' },
  { id: 11, description: 'Restaurant Dinner', category: 'food', amount: -62.00, date: '2026-04-25', type: 'expense', icon: '🍽️' },
  { id: 12, description: 'Dividend Income', category: 'salary', amount: 340.00, date: '2026-04-24', type: 'income', icon: '📈' },
];

let categories = [
  { id: 1, name: 'Food & Dining', key: 'food', icon: '🍽️', color: '#ff6b6b', budget: 500 },
  { id: 2, name: 'Shopping', key: 'shopping', icon: '🛍️', color: '#a29bfe', budget: 300 },
  { id: 3, name: 'Transport', key: 'transport', icon: '🚗', color: '#74b9ff', budget: 150 },
  { id: 4, name: 'Entertainment', key: 'entertainment', icon: '🎬', color: '#fd79a8', budget: 100 },
  { id: 5, name: 'Health', key: 'health', icon: '💊', color: '#55efc4', budget: 200 },
  { id: 6, name: 'Utilities', key: 'utilities', icon: '⚡', color: '#fdcb6e', budget: 250 },
  { id: 7, name: 'Salary', key: 'salary', icon: '💼', color: '#00b894', budget: 0 },
  { id: 8, name: 'Freelance', key: 'freelance', icon: '💻', color: '#0984e3', budget: 0 },
];

let user = {
  id: 1,
  name: 'Dinesh Kumar',
  email: 'dinesh@pennyai.com',
  avatar: null,
  currency: 'USD',
  language: 'en',
  darkMode: true,
  notifications: true,
};

export { transactions, categories, user };

export function getTransactions() { return [...transactions]; }
export function addTransaction(t) {
  const newT = { ...t, id: Date.now() };
  transactions = [newT, ...transactions];
  return newT;
}
export function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
}
export function getCategories() { return [...categories]; }
export function addCategory(c) {
  const newC = { ...c, id: Date.now() };
  categories = [...categories, newC];
  return newC;
}
export function updateCategory(id, data) {
  categories = categories.map(c => c.id === id ? { ...c, ...data } : c);
}
export function deleteCategory(id) {
  categories = categories.filter(c => c.id !== id);
}
export function getUser() { return { ...user }; }
export function updateUser(data) {
  user = { ...user, ...data };
  return user;
}

export const monthlyData = [
  { month: 'Jan', income: 6200, expense: 3800 },
  { month: 'Feb', income: 5800, expense: 4200 },
  { month: 'Mar', income: 6400, expense: 3600 },
  { month: 'Apr', income: 6740, expense: 4100 },
  { month: 'May', income: 6400, expense: 3520 },
  { month: 'Jun', income: 7100, expense: 3900 },
];

export const spendingTrendData = [
  { week: 'Week 1', amount: 820 },
  { week: 'Week 2', amount: 1100 },
  { week: 'Week 3', amount: 760 },
  { week: 'Week 4', amount: 950 },
  { week: 'Week 5', amount: 680 },
  { week: 'Week 6', amount: 1230 },
  { week: 'Week 7', amount: 890 },
  { week: 'Week 8', amount: 1050 },
];

export const aiInsights = [
  { id: 1, icon: '📊', text: 'You spent 20% more on food this week compared to last week.', type: 'warning' },
  { id: 2, icon: '🎯', text: "Great job! You're on track to save $800 this month.", type: 'success' },
  { id: 3, icon: '💡', text: 'Switching to annual subscriptions could save you $120/year.', type: 'tip' },
  { id: 4, icon: '⚠️', text: 'Your entertainment spending is 30% above your budget.', type: 'warning' },
];

export const aiSuggestedPrompts = [
  'How much did I spend this month?',
  'What are my biggest expenses?',
  'How can I save more money?',
  'Analyze my spending trends',
  'Am I on track with my budget?',
  'Show my income vs expenses',
];

export const aiResponses = {
  default: (msg) => `Based on your financial data, I can see you're asking about "${msg}". Your current monthly balance shows $2,880 in savings. Your top spending categories are Food ($140.45), Shopping ($223.99), and Entertainment ($25.98). I recommend setting a budget for entertainment and reducing dining out by 15% to improve your savings rate to 45%.`,
  spend: () => `📊 **Monthly Spending Analysis**\n\nThis month you've spent **$570.13** across all categories:\n\n• 🍽️ Food & Dining: $140.45 (25%)\n• 🛍️ Shopping: $223.99 (39%)\n• 🎬 Entertainment: $25.98 (5%)\n• ⚡ Utilities: $120.50 (21%)\n• 🚗 Transport: $14.20 (2%)\n• 💪 Health: $45.00 (8%)\n\nYou're **12% under budget** this month. Keep it up!`,
  save: () => `💰 **Savings Recommendations**\n\n1. **Cancel unused subscriptions** – You're paying for both Netflix & Spotify ($26/mo)\n2. **Meal prep** – Could save ~$200/month on food\n3. **Use public transport** – Save ~$60/month\n4. **Set up auto-savings** – Transfer 20% on payday\n\n✅ Estimated monthly savings increase: **$285**`,
  income: () => `📈 **Income Analysis**\n\nYour total income this month: **$6,400**\n\n• 💼 Salary: $5,200 (81%)\n• 💻 Freelance: $1,200 (19%)\n\nYour income is **8.5% higher** than last month. Consider investing the extra in index funds for long-term growth!`,
};
