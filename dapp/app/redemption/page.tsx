"use client";

import { useState, useMemo } from "react";
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
import { Slider } from "@/components/ui/slider";
import { ArrowDownRight, Clock } from "lucide-react";

export default function RedemptionPage() {
  const [redeemAmount, setRedeemAmount] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null);

  const mCKBBalance = 2500;

  const redemptionOptions = [
    {
      time: "Instant",
      fee: 2.0,
      days: 0,
      description: "Immediate settlement",
    },
    { time: "1 Day", fee: 1.0, days: 1, description: "Wait 1 day" },
    { time: "7 Days", fee: 0.5, days: 7, description: "Wait 1 week" },
    { time: "14 Days", fee: 0.3, days: 14, description: "Wait 2 weeks" },
    { time: "30 Days", fee: 0, days: 30, description: "No fee" },
  ];

  // Calculate redemption summary based on amount and selected speed
  const redemptionSummary = useMemo(() => {
    const amount = Number(redeemAmount || 0);
    if (!amount || !selectedSpeed) {
      return {
        receive: 0,
        fee: 0,
        feePercent: 0,
        availableAfter: null,
      };
    }

    const option = redemptionOptions.find((o) => o.time === selectedSpeed);
    if (!option) {
      return {
        receive: 0,
        fee: 0,
        feePercent: 0,
        availableAfter: null,
      };
    }

    const fee = (amount * option.fee) / 100;
    const receive = amount - fee;
    const availableAfter =
      option.days > 0 ? new Date(Date.now() + option.days * 86400000) : null;

    return {
      receive,
      fee,
      feePercent: option.fee,
      availableAfter,
    };
  }, [redeemAmount, selectedSpeed]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Redemption</h2>
          <p className="text-muted-foreground">
            Exchange mCKB 1:1 for CKB windows
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Redemption Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Redeem mCKB for CKB</CardTitle>
                <CardDescription>
                  Choose your redemption window to optimize fees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="redeem">mCKB to Redeem</Label>
                    <p className="text-xs text-muted-foreground">
                      Balance: {mCKBBalance.toLocaleString()} mCKB
                    </p>
                  </div>
                  <div className="space-y-2 px-1 relative">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>{mCKBBalance.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 w-24">
                        <Input
                          id="redeem"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={redeemAmount}
                          onChange={(e) => setRedeemAmount(e.target.value)}
                          className="text-center px-2 py-1 text-sm h-8"
                        />
                      </div>
                      <Slider
                        value={[Number(redeemAmount || 0)]}
                        onValueChange={(value) =>
                          setRedeemAmount(value[0].toString())
                        }
                        min={0}
                        max={mCKBBalance}
                        step={Math.max(0.01, mCKBBalance / 100)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>{mCKBBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Redemption Speed</Label>
                  <div className="flex flex-wrap gap-2">
                    {redemptionOptions.map((option) => (
                      <Button
                        key={option.time}
                        variant="outline"
                        className={`flex-1 min-w-[100px] h-auto py-3 ${
                          selectedSpeed === option.time
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => setSelectedSpeed(option.time)}
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-semibold text-sm">
                              {option.time}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {option.fee}%
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lower fees reward patience. Instant settlement incurs higher
                    costs to protect protocol solvency.
                  </p>
                </div>

                {redeemAmount && selectedSpeed && (
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        You will receive
                      </span>
                      <span className="font-medium">
                        {redemptionSummary.receive.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        CKB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Redemption Fee
                      </span>
                      <span className="font-medium">
                        {redemptionSummary.fee.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        mCKB ({redemptionSummary.feePercent}%)
                      </span>
                    </div>
                    {redemptionSummary.availableAfter && (
                      <div className="flex justify-between text-sm pt-2 border-t border-border">
                        <span className="text-muted-foreground">
                          Available After
                        </span>
                        <span className="font-medium">
                          {redemptionSummary.availableAfter.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Button className="w-full" size="lg" disabled={!selectedSpeed}>
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  {selectedSpeed
                    ? `Redeem with ${selectedSpeed} Wait`
                    : "Select Redemption Speed"}
                </Button>
              </CardContent>
            </Card>

            {/* Pending Redemptions */}
            <Card>
              <CardHeader>
                <CardTitle>My Pending Redemptions</CardTitle>
                <CardDescription>
                  Track your active redemption requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      amount: "1,000 mCKB",
                      receives: "1,015 CKB",
                      status: "Processing",
                      timeLeft: "3 days",
                      progress: 60,
                    },
                    {
                      amount: "500 mCKB",
                      receives: "508 CKB",
                      status: "Processing",
                      timeLeft: "15 days",
                      progress: 25,
                    },
                  ].map((redemption, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{redemption.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            Receives: {redemption.receives}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                        >
                          {redemption.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Time remaining
                          </span>
                          <span className="font-medium">
                            {redemption.timeLeft}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${redemption.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">mCKB Balance</span>
                    <span className="font-medium">2,500 mCKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CKB Balance</span>
                    <span className="font-medium">10,000 CKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">In Redemption</span>
                    <span className="font-medium">1,500 mCKB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>How Redemption Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Redemption exchanges mCKB for protocol collateral. Redemptions
                  are ordered by ICR, with lower ICR providers targeted first.
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <p className="text-muted-foreground">
                      <strong>Settlement Windows:</strong> Instant to 28 days
                      with transparent fees.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <p className="text-muted-foreground">
                      <strong>Default Asset:</strong> Redemption defaults to
                      iCKB; CKB may require extra waiting time.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <p className="text-muted-foreground">
                      <strong>$COMINE (M2):</strong> Use $COMINE to waive
                      one-time redemption fees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    mCKB/CKB Rate
                  </span>
                  <span className="text-sm font-medium">1.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    24h Redemptions
                  </span>
                  <span className="text-sm font-medium">12,450 mCKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Liquidity Available
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    High
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
