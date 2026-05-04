export interface IncomingTransaction {
  transactionId: string
  userId: string
  amount: number
  currency: string
  country: string
  ip: string
  timestamp: string
}

export interface getTransactions {
    id: string;
    transactionId: string;
    userId: string;
    amount: number;
    currency: string;
    country: string;
    ip: string;
    timestamp: Date;
    riskScore: number | null;
    flagged: boolean;
    reasons: string[];
    createdAt: Date;
}

export interface userbehaviour {
  avgAmount: number
  maxAmount: number
  countriesUsed: string[]
}

export interface fraudAnalysis {
  riskScore: number,
  reasons: string[]
  flagged: boolean
}