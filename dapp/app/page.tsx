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
    collateralLocked: "24,856,432",
    activeSchedules: 1247,
    tcr: 167,
    mckbSupply: "18.6M",
    treasuryReserve: "12.4M",
    liquidityAPY: "8.5",
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-6" variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            Milestone 1: Collective Mining
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Tokenised CKB Mining for
            <span className="text-primary"> the Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            CoMine blends mining schedules with collateralised debt positions so
            miners and sponsors can share mining yields, access liquidity
            earlier, and keep the protocol solvent with transparent rules.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/mining">
                Explore Mining Schedules
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">Read the Docs</Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {mockData.collateralLocked} CKB
              </p>
              <p className="text-sm text-muted-foreground">
                Total Collateral Locked
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{mockData.activeSchedules}</p>
              <p className="text-sm text-muted-foreground">
                Active Mining Schedules
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{mockData.tcr}%</p>
              <p className="text-sm text-muted-foreground">
                Total Collateral Ratio
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{mockData.mckbSupply}</p>
              <p className="text-sm text-muted-foreground">mCKB Supply</p>
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
                  <CardTitle>Create a Schedule</CardTitle>
                  <CardDescription>
                    Mining providers and sponsors publish offerings or
                    recruiting schedules with clear pricing.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Mint mCKB</CardTitle>
                  <CardDescription>
                    Sponsors mint mining contract tokens against miner debt and
                    earn future mining yields.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Redeem by Queue</CardTitle>
                  <CardDescription>
                    Redeem mCKB 1:1 for collateral through time-based options
                    and ICR-prioritised redemption queues.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Treasury Safeguards</CardTitle>
                  <CardDescription>
                    Liquidation and treasury mechanisms protect solvency while
                    funding protocol sustainability.
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
                Built for Collective Mining
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Mining Offering & Recruiting
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Publish schedules with explicit pricing, immediate
                      funding, and clear debt obligations for mining providers.
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
                      Choose between instant and longer settlement windows with
                      transparent fee schedules.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Recovery Mode Guardrails
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      CCR and LCR thresholds enforce partial and full
                      liquidation to protect solvency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Protocol Treasury Health</CardTitle>
                <CardDescription>
                  Collateral and redemption status
                </CardDescription>
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
                    Treasury Reserve
                  </span>
                  <span className="text-lg font-semibold">
                    {mockData.treasuryReserve} CKB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    mCKB Supply
                  </span>
                  <span className="text-lg font-semibold">
                    {mockData.mckbSupply}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Stability Pool APY (M2)
                  </span>
                  <span className="text-lg font-semibold">
                    {mockData.liquidityAPY}%
                  </span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/statistics">View Full Statistics Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Publish a Mining Schedule?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Create a mining offering or join a recruiting schedule to access
              liquidity and future mining yields.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/mining">Launch Mining Schedule</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">Explore Protocol Docs</Link>
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
