'use client'

import Button from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import StatCard from "@/app/components/ui/StatCard";
import { alertStats, CaseStats, dashboardSummary } from "@/app/types";
import { AlertCircle, BarChart3, FileText, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const [stats, setStats] = useState<dashboardSummary>({
    transactionCount: 0,
    alertCount: 0,
    caseCount: 0
  });

  const [alerts, setAlerts] = useState<alertStats[]>([]);
  const [cases, setCases] = useState<CaseStats[]>([]);

  async function fetchAlerts() {
    const response = await fetch(`http://localhost:3000/alerts`);
    const data: { getAlerts: alertStats[] } = await response.json();
    setAlerts(data.getAlerts);
  }

  async function fetchCases() {
    const response = await fetch(`http://localhost:3000/cases?status=OPEN`);
    const data = await response.json();
    setCases(data.cases);
  }

  async function fetchDashboardSummary() {
    const response = await fetch(`http://localhost:3000/dashboard`);
    const data = await response.json();
    setStats(data.data); // ✅ correct
  }

  useEffect(() => {
    fetchAlerts();
    fetchCases();
    fetchDashboardSummary();
  }, []);

  const topCases = cases
    .slice()
    .sort((a, b) => b.totalRiskScore - a.totalRiskScore)
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

        <Button
          isActive={true}
          label="Refresh"
          icon={<RefreshCw className="w-4 h-4 mr-2" />}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={stats.transactionCount}
          icon={<BarChart3 className="w-4 h-4" />}
          trend={0}
          trendLabel="this month"
        />
        <StatCard
          title="Alerts Today"
          value={stats.alertCount}
          icon={<AlertCircle className="w-4 h-4" />}
          trend={0}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Open Cases"
          value={stats.caseCount}
          icon={<FileText className="w-4 h-4" />}
          trend={0}
          trendLabel="this week"
        />
        <StatCard
          title="Overall Risk"
          value={`${0}%`}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No alerts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.alertId}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <AlertCircle
                      className={`w-4 h-4 mt-1 ${
                        alert.riskScore >= 50
                          ? 'text-red-600'
                          : alert.riskScore >= 30
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {alert.alertId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.reasons}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        alert.riskScore >= 50
                          ? 'bg-red-100 text-red-800'
                          : alert.riskScore >= 30
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {alert.riskScore >= 50
                        ? "High"
                        : alert.riskScore >= 30
                        ? "Medium"
                        : "Low"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cases */}
        <Card className="overflow-auto">
          <CardHeader>
            <CardTitle>Active Cases (High Risk First)</CardTitle>
          </CardHeader>

          <CardContent>
            {topCases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No cases yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCases.map((caseItem) => (
                  <div
                    key={caseItem.caseId}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <FileText className="w-4 h-4 mt-1 text-blue-600" />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {caseItem.caseId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: {caseItem.status}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full bg-red-200`}
                    >
                      {caseItem.totalRiskScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}