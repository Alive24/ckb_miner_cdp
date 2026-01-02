"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, Shield, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Protocol Statistics</h2>
          <p className="text-muted-foreground">
            Treasury, miner activity, and system-wide health metrics
          </p>
        </div>

        {/* Protocol Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Total Collateral Locked
              </CardDescription>
              <CardTitle className="text-3xl font-bold tracking-tight">
                24.8M CKB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5% this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Active Mining Schedules
              </CardDescription>
              <CardTitle className="text-3xl font-bold tracking-tight">
                1,247
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>18.6M mCKB in Supply</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Total Collateral Ratio
              </CardDescription>
              <CardTitle className="text-3xl font-bold tracking-tight">
                167%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={67} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Healthy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">
                Treasury Solvency
              </CardDescription>
              <CardTitle className="text-xl font-bold tracking-tight">
                Normal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className="gap-1 bg-green-500/10 text-green-600 border-green-500/20"
              >
                <Shield className="h-3 w-3" />
                TCR above CCR
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Protocol & Miner Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Miner Activity</CardTitle>
                <CardDescription>Registered mining providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Active Miners
                    </p>
                    <p className="text-2xl font-bold">3,456</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      New Registrations (7d)
                    </p>
                    <p className="text-2xl font-bold">182</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Avg ICR
                    </p>
                    <p className="text-2xl font-bold">187%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Recovery Mode Miners
                    </p>
                    <p className="text-2xl font-bold">38</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Collateral Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Collateral Distribution</CardTitle>
                <CardDescription>
                  Breakdown by Individual Collateral Ratio (ICR)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      range: "200%+",
                      percentage: 35,
                      amount: "8.7M CKB",
                      providers: 387,
                      color: "bg-green-600",
                    },
                    {
                      range: "180-200%",
                      percentage: 28,
                      amount: "6.9M CKB",
                      providers: 445,
                      color: "bg-green-500",
                    },
                    {
                      range: "160-180%",
                      percentage: 22,
                      amount: "5.5M CKB",
                      providers: 298,
                      color: "bg-yellow-500",
                    },
                    {
                      range: "150-160%",
                      percentage: 12,
                      amount: "3.0M CKB",
                      providers: 97,
                      color: "bg-orange-500",
                    },
                    {
                      range: "<150%",
                      percentage: 3,
                      amount: "750K CKB",
                      providers: 20,
                      color: "bg-red-500",
                    },
                  ].map((tier, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{tier.range} ICR</span>
                        <span className="text-muted-foreground">
                          {tier.providers} providers
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-8 bg-muted rounded-lg overflow-hidden">
                            <div
                              className={`h-full ${tier.color} flex items-center justify-between px-3`}
                              style={{ width: `${tier.percentage}%` }}
                            >
                              <span className="text-xs font-medium text-white">
                                {tier.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium w-24 text-right">
                          {tier.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Protocol Activity</CardTitle>
                <CardDescription>Latest 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: "Mining Offering",
                      user: "0x7a8b...3c4d",
                      amount: "5,000 CKB",
                      time: "2 min ago",
                    },
                    {
                      type: "Mining Recruiting",
                      user: "0x9f2e...1a5b",
                      amount: "2,500 mCKB",
                      time: "8 min ago",
                    },
                    {
                      type: "Redemption",
                      user: "0x4c6d...8e2f",
                      amount: "10,000 CKB",
                      time: "15 min ago",
                    },
                    {
                      type: "Liquidation",
                      user: "0x1b3c...9d7e",
                      amount: "1,200 mCKB",
                      time: "32 min ago",
                    },
                    {
                      type: "Repayment",
                      user: "0x5e7f...2a4b",
                      amount: "7,500 CKB",
                      time: "1 hour ago",
                    },
                    {
                      type: "Redemption",
                      user: "0x8d9a...6c3e",
                      amount: "4,000 mCKB",
                      time: "2 hours ago",
                    },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.type}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {activity.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Protocol Flows */}
            <Card>
              <CardHeader>
                <CardTitle>Protocol Flows</CardTitle>
                <CardDescription>Treasury and system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Redemptions Settled
                    </p>
                    <p className="text-2xl font-bold">12,847 mCKB</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Liquidations Executed
                    </p>
                    <p className="text-2xl font-bold">248</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Treasury Revenue (24h)
                    </p>
                    <p className="text-2xl font-bold">18,450 CKB</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Recovery Mode Entries
                    </p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redemption Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Redemption Statistics</CardTitle>
                <CardDescription>
                  Redemption activity and queue metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Redemptions (30d)
                    </p>
                    <p className="text-2xl font-bold">45,230 mCKB</p>
                    <p className="text-xs text-green-600 mt-1">
                      +8.2% vs last month
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Pending Redemptions
                    </p>
                    <p className="text-2xl font-bold">8,450 mCKB</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg wait: 5.2 days
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Redemption Fees (30d)
                    </p>
                    <p className="text-2xl font-bold">1,125 CKB</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Distributed to LPs
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">
                      Avg Redemption Size
                    </p>
                    <p className="text-2xl font-bold">2,847 mCKB</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per transaction
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Instant Redemptions (30d)
                    </span>
                    <span className="font-medium">12,450 mCKB (27.5%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Scheduled Redemptions (30d)
                    </span>
                    <span className="font-medium">32,780 mCKB (72.5%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Redemption Queue Depth
                    </span>
                    <span className="font-medium text-yellow-600">
                      Moderate
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System Status */}
          <div className="space-y-6">
            {/* System Health */}
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>All critical metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-sm">TCR Status</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-sm">Liquidity</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    Stability Pool Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-sm">Oracle Price</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-600" />
                    <span className="text-sm">At-Risk Positions</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  >
                    20 (&lt;2%)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Solvency Metrics */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle>Solvency Metrics</CardTitle>
                <CardDescription>
                  Protocol solvency and safety metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Collateral Ratio (TCR)
                    </span>
                    <span className="text-lg font-bold text-primary">167%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Critical Collateral Ratio (CCR)
                    </span>
                    <span className="text-sm font-medium">150%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Liquidation Collateral Ratio (LCR)
                    </span>
                    <span className="text-sm font-medium">150%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Safety Margin
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        +17%
                      </span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Well above recovery mode threshold
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Collateral Coverage
                    </span>
                    <span className="font-medium">1.67x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Solvency Buffer
                    </span>
                    <span className="font-medium text-green-600">4.2M CKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Max Redemption Capacity
                    </span>
                    <span className="font-medium">14.6M CKB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle>Critical Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Liquidation Collateral Ratio (LCR)
                    </span>
                    <span className="font-medium">150%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Critical Collateral Ratio (CCR)
                    </span>
                    <span className="font-medium">150%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Current TCR vs CCR
                    </span>
                    <span className="font-medium text-green-600">+17%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Well above recovery mode threshold
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Treasury Reserves */}
            <Card>
              <CardHeader>
                <CardTitle>Treasury Reserves</CardTitle>
                <CardDescription>Protocol-owned assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    CKB Reserve
                  </span>
                  <span className="text-sm font-medium">12.4M CKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Liquidity (M2)
                  </span>
                  <span className="text-sm font-medium">1.8M mCKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Fee Revenue (30d)
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    54,467 CKB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    $COMINE (M2)
                  </span>
                  <span className="text-sm font-medium">2.5M</span>
                </div>
              </CardContent>
            </Card>

            {/* Liquidation Queue */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <CardTitle>Liquidation Queue</CardTitle>
                </div>
                <CardDescription>Positions near liquidation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icr: "152%", debt: "1,200 mCKB", collateral: "1,824 CKB" },
                  { icr: "155%", debt: "800 mCKB", collateral: "1,240 CKB" },
                  { icr: "157%", debt: "1,500 mCKB", collateral: "2,355 CKB" },
                ].map((position, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-orange-500/20 bg-orange-500/5"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <Badge
                        variant="outline"
                        className="bg-orange-500/10 text-orange-600 border-orange-500/20"
                      >
                        ICR: {position.icr}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        At risk
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="block">Debt: {position.debt}</span>
                      <span className="block">
                        Collateral: {position.collateral}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Earn Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Earn Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Stakers</span>
                  <span className="font-medium">6,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    30d Fees Distributed
                  </span>
                  <span className="font-medium">62,400 CKB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    $COMINE Circulating
                  </span>
                  <span className="font-medium">2.5M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Average Estimated APY
                  </span>
                  <span className="font-medium text-green-600">~9.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
