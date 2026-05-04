export interface dashboardSummary {
  transactionCount: number,
  alertCount: number,
  caseCount: number
}

export interface DashboardStats {
  totalTransactions: number;
  alertsToday: number;
  casesOpen: number;
  riskScore: number;
  flaggedRate: number;
}

export interface alertStats {
  alertId: number
  riskScore: number
  reasons: string[]
  transactionId: string
  createdAt: string
}

export interface CaseStats {
  caseId: string
  status: string
  notes: string[]
  createdAt: string
  updatedAt: string
  totalRiskScore: number
  assigned_to: string[]
}