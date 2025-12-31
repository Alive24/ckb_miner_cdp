"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Layers,
  DollarSign,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function CoMinePage() {
  // Mock data
  const mockData = {
    tvl: "24,856,432",
    totalDebt: "18,642,100",
    icr: 185,
    tcr: 167,
    miningRewards: "1,245.67",
    liquidityProvided: "500,000",
    activeProviders: 1247,
    liquidityAPY: "8.5",
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-6" variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            Now Live on Nervos Network
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Unlock Liquidity from
            <span className="text-primary"> CKB Mining</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            CoMine is a decentralized protocol that enables CKB holders to earn
            mining rewards while maintaining liquidity through collateralized
            debt positions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/mining">
                Start Mining
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/treasury">View Protocol Stats</Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold">${mockData.tvl}</p>
              <p className="text-sm text-muted-foreground">
                Total Value Locked
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{mockData.tcr}%</p>
              <p className="text-sm text-muted-foreground">
                Avg Collateral Ratio
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{mockData.activeProviders}</p>
              <p className="text-sm text-muted-foreground">Active Providers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{mockData.liquidityAPY}%</p>
              <p className="text-sm text-muted-foreground">Liquidity APY</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">
              How CoMine Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Stake Collateral</CardTitle>
                  <CardDescription>
                    Lock your CKB tokens as collateral to create mining
                    offerings and mint mCKB tokens
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Mine CKB</CardTitle>
                  <CardDescription>
                    Participate in Nervos mining pools and earn block rewards
                    while your collateral remains locked
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Use mCKB</CardTitle>
                  <CardDescription>
                    Trade or use your mCKB tokens while continuing to earn
                    mining rewards on your collateral
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Redeem or Provide Liquidity</CardTitle>
                  <CardDescription>
                    Redeem mCKB for collateral anytime, or earn fees by
                    providing liquidity to the protocol
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Built for Security and Efficiency
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Collateralized Debt Positions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Every mCKB token is backed by over-collateralized CKB with
                      a minimum 150% collateral ratio
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Flexible Redemption</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose your redemption speed from instant to 28 days with
                      varying fee structures
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Earn Multiple Yield Streams
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Mining rewards, liquidation bonuses, redemption fees, and
                      protocol token incentives
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Protocol Treasury Health</CardTitle>
                <CardDescription>Real-time protocol metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Collateral Ratio
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {mockData.tcr}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Protocol Mode
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    Normal Operations
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Liquidity Pool Size
                  </span>
                  <span className="text-lg font-semibold">
                    {mockData.tvl} CKB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    24h Mining Volume
                  </span>
                  <span className="text-lg font-semibold">2,847 CKB</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/treasury">View Full Treasury Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Start Mining?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of CKB holders who are earning mining rewards while
              maintaining liquidity through CoMine
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/mining">Start Mining</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/treasury">View Treasury</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">CoMine</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized CKB Mining CDP Protocol on Nervos Network
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
