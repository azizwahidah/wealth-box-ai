export interface DebtItem {
  name: string;
  balance: number;
  rate?: number;
  monthlyPayment?: number;
}

export interface AssetItem {
  name: string;
  balance: number;
}

export interface UserProfile {
  id: string;
  emoji: string;
  name: string;
  age: number | string; // string for couples like "59/57"
  occupation: string;
  location: string;
  maritalStatus: string;
  householdSize: number;
  shortBio: string;
  income: number;
  incomeNote?: string;
  housing: {
    type: "renter" | "homeowner";
    monthlyPayment: number;
    homeValue?: number;
  };
  additionalExpenses?: { name: string; amount: number }[];
  debts: DebtItem[];
  assets: AssetItem[];
  creditScore: number | string; // string for couples like "810/805"
  goals: string[];
  suggestedQuestions: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
