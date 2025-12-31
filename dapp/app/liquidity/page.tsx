"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Droplets, Gift } from "lucide-react";

export default function LiquidityPage() {
  const [depositAmount, setDepositAmount] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Stability Pool (M2)</h2>
          <p className="text-muted-foreground">
            Provide stability liquidity to support redemptions and liquidations,
            and earn protocol rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Liquidity */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Provide Stability Liquidity</CardTitle>
                <CardDescription>
                  Deposit CKB to back redemptions and liquidation flows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="liquidity">CKB Amount</Label>
                  <Input
                    id="liquidity"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: 10,000 CKB
                  </p>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Estimated Returns (M2)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Base APY</p>
                      <p className="text-2xl font-bold text-green-600">8.5%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        + Bonus APY
                      </p>
                      <p className="text-2xl font-bold text-primary">2.3%</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total APY (Target)
                      </span>
                      <span className="text-xl font-bold">10.8%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Your Pool Share
                    </span>
                    <span className="font-medium">12.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Stability Shares
                    </span>
                    <span className="font-medium">~9,950 SP-CKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deposit Fee</span>
                    <span className="font-medium">0.5%</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Droplets className="mr-2 h-4 w-4" />
                  Add Liquidity
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>
                  How stability providers earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      source: "Redemption Fees",
                      percentage: "45%",
                      description: "Fees collected from redemption queues",
                      amount: "2,450 CKB",
                    },
                    {
                      source: "Liquidation Bonuses",
                      percentage: "30%",
                      description: "Rewards from liquidation participation",
                      amount: "1,634 CKB",
                    },
                    {
                      source: "Mining Offering Fees",
                      percentage: "15%",
                      description: "Fees from creating new mining schedules",
                      amount: "817 CKB",
                    },
                    {
                      source: "Protocol Token (M2)",
                      percentage: "10%",
                      description: "Protocol token rewards from treasury",
                      amount: "545 CKB",
                    },
                  ].map((revenue, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="font-medium">{revenue.source}</span>
                        </div>
                        <Badge variant="secondary">{revenue.percentage}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {revenue.description}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        30d: {revenue.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Position & Stats */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Your Stability Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Provided
                  </span>
                  <span className="font-semibold">500,000 CKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Pool Share
                  </span>
                  <span className="font-semibold">12.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Stability Shares
                  </span>
                  <span className="font-semibold">497,500 SP-CKB</span>
                </div>

                <div className="pt-4 border-t border-primary/20">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Earned Fees
                      </span>
                      <span className="font-semibold text-green-600">
                        245.89 CKB
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Protocol Tokens (M2)
                      </span>
                      <span className="font-semibold text-primary">1,234</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button size="sm" className="gap-1">
                    <Gift className="h-3 w-3" />
                    Claim
                  </Button>
                  <Button size="sm" variant="outline">
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pool Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Pool Size
                  </span>
                  <span className="text-sm font-medium">12.4M CKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Providers
                  </span>
                  <span className="text-sm font-medium">3,456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    24h Volume
                  </span>
                  <span className="text-sm font-medium">125,000 CKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    30d Fees Earned
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    54,467 CKB
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <p className="text-muted-foreground">
                    Support faster redemptions for the community
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <p className="text-muted-foreground">
                    Participate in liquidation rewards
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <p className="text-muted-foreground">
                    Earn protocol tokens (M2)
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <p className="text-muted-foreground">
                    Withdraw anytime without long lockups
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
