"use client";

import { useMemo, useState } from "react";
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
import { TrendingUp, Zap, Coins } from "lucide-react";

export default function EarnPage() {
  const [liquidityToken, setLiquidityToken] = useState("iCKB");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [comineStakeAmount, setComineStakeAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  const issuance = 12_500_000;
  const supply = 5_200_000;
  const cominePrice = issuance / supply;

  const estimatedStake = useMemo(() => {
    const amount = Number(buyAmount || 0);
    if (!amount || !cominePrice) {
      return 0;
    }
    return amount / cominePrice;
  }, [buyAmount, cominePrice]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Earn</h2>
          <p className="text-muted-foreground">
            Stake liquidity assets or $COMINE to earn protocol yield and fee
            share.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stake Liquidity</CardTitle>
                <CardDescription>
                  Stake iCKB, CKB, or mCKB to earn stability rewards.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {["iCKB", "CKB", "mCKB"].map((token) => (
                    <Button
                      key={token}
                      type="button"
                      variant={liquidityToken === token ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLiquidityToken(token)}
                    >
                      {token}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liquidity-amount">
                    Amount ({liquidityToken})
                  </Label>
                  <Input
                    id="liquidity-amount"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={liquidityAmount}
                    onChange={(e) => setLiquidityAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: 10,000 {liquidityToken}
                  </p>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Estimated Rewards</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Base APY</p>
                      <p className="text-2xl font-bold text-green-600">7.8%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Bonus APY ($COMINE)
                      </p>
                      <p className="text-2xl font-bold text-primary">2.1%</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total APY (Target)
                      </span>
                      <span className="text-xl font-bold">9.9%</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Zap className="mr-2 h-4 w-4" />
                  Stake Liquidity
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
              <CardTitle>Stake $COMINE</CardTitle>
              <CardDescription>
                  Stake $COMINE for fee share and governance boosts.
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="comine-stake">Amount ($COMINE)</Label>
                  <Input
                    id="comine-stake"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={comineStakeAmount}
                    onChange={(e) => setComineStakeAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: 24,500 $COMINE
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Revenue Share Boost
                    </span>
                    <span className="font-medium">1.4x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Governance Weight
                    </span>
                    <span className="font-medium">+12.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Staking Duration
                    </span>
                    <span className="font-medium">30 days</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" variant="outline">
                  Stake $COMINE
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Buy Staked $COMINE</CardTitle>
                <CardDescription>
                  Price is derived from issuance and supply.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issuance</span>
                    <span className="font-medium">
                      {issuance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Supply</span>
                    <span className="font-medium">
                      {supply.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Implied Price
                    </span>
                    <span className="font-semibold">
                      {cominePrice.toFixed(4)} CKB
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-comine">Pay in CKB</Label>
                  <Input
                    id="buy-comine"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Estimated sCOMINE:{" "}
                    <span className="font-medium">
                      {estimatedStake.toFixed(2)}
                    </span>
                  </p>
                </div>

                <Button className="w-full">Buy & Stake $COMINE</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Earn Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Liquidity Staked
                  </span>
                  <span className="font-semibold">480,000 CKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    $COMINE Staked
                  </span>
                  <span className="font-semibold">18,450 $COMINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Pending Rewards
                  </span>
                  <span className="font-semibold text-green-600">
                    1,240 CKB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button size="sm" className="gap-1">
                    <Coins className="h-3 w-3" />
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
                    Average APY
                  </span>
                  <span className="font-medium text-green-600">9.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
