"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Wallet,
  ArrowUpRight,
  AlertCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function MiningPage() {
  const [collateralAmount, setCollateralAmount] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffering, setSelectedOffering] = useState<number | null>(null);

  const offerings = [
    {
      id: 1,
      provider: "0x7a8b...3c4d",
      rate: "3.2%",
      volume: "50,000",
      icr: "195%",
      status: "active",
      minAmount: "1,000",
      duration: "30 days",
    },
    {
      id: 2,
      provider: "0x9f2e...1a5b",
      rate: "3.5%",
      volume: "75,000",
      icr: "210%",
      status: "active",
      minAmount: "5,000",
      duration: "60 days",
    },
    {
      id: 3,
      provider: "0x4c6d...8e2f",
      rate: "3.8%",
      volume: "100,000",
      icr: "185%",
      status: "active",
      minAmount: "2,500",
      duration: "90 days",
    },
    {
      id: 4,
      provider: "0x1b3c...9d7e",
      rate: "3.1%",
      volume: "25,000",
      icr: "200%",
      status: "active",
      minAmount: "500",
      duration: "30 days",
    },
    {
      id: 5,
      provider: "0x5e8f...2a1c",
      rate: "3.6%",
      volume: "60,000",
      icr: "188%",
      status: "active",
      minAmount: "3,000",
      duration: "45 days",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Mining</h2>
          <p className="text-muted-foreground">
            Create mining offerings or recruit from existing providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="offering" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="offering">Mining Offering</TabsTrigger>
                <TabsTrigger value="recruiting">Mining Recruiting</TabsTrigger>
              </TabsList>

              {/* Mining Offering Tab */}
              <TabsContent value="offering" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stake Collateral & Mint mCKB</CardTitle>
                    <CardDescription>
                      Lock CKB as collateral to participate in mining and mint
                      mCKB tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="collateral">Collateral Amount (CKB)</Label>
                      <Input
                        id="collateral"
                        type="number"
                        placeholder="0.00"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Available: 10,000 CKB
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mint">mCKB to Mint</Label>
                      <Input
                        id="mint"
                        type="number"
                        placeholder="0.00"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Max mintable: 5,400 mCKB (based on 185% CR)
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Collateral Ratio
                        </span>
                        <span className="font-medium">185%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Liquidation Price
                        </span>
                        <span className="font-medium">$0.0089</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Mining Offering Fee
                        </span>
                        <span className="font-medium">0.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Est. Annual Mining Yield
                        </span>
                        <span className="font-medium text-green-600">3.2%</span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-600">
                            Important Information
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your collateral will be locked and used for CKB
                            mining. You must maintain a minimum 150% collateral
                            ratio to avoid liquidation. Mining rewards will be
                            distributed based on your share of the total mining
                            pool.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Create Mining Offering
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mining Recruiting Tab */}
              <TabsContent value="recruiting" className="mt-6">
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by provider address..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Sort by APY
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Offerings List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Mining Offerings</CardTitle>
                      <CardDescription>
                        Select an offering to participate in CKB mining as a
                        sponsor
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {offerings.map((offer) => (
                          <div
                            key={offer.id}
                            className={`p-4 rounded-lg border transition-all cursor-pointer ${
                              selectedOffering === offer.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedOffering(offer.id)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-mono text-sm font-medium">
                                    {offer.provider}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-500/10 text-green-600 border-green-500/20"
                                  >
                                    {offer.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Min Amount: {offer.minAmount} mCKB • Duration:{" "}
                                  {offer.duration}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                  {offer.rate}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  APY
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Total Volume
                                </p>
                                <p className="text-sm font-medium">
                                  {offer.volume} mCKB
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Collateral Ratio
                                </p>
                                <p className="text-sm font-medium">
                                  {offer.icr}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accept Offering Card */}
                  {selectedOffering && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Accept Offering</CardTitle>
                        <CardDescription>
                          Enter amount to sponsor
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sponsor-amount">
                            Sponsorship Amount (mCKB)
                          </Label>
                          <Input
                            id="sponsor-amount"
                            type="number"
                            placeholder="0.00"
                          />
                          <p className="text-xs text-muted-foreground">
                            Available: 5,000 mCKB
                          </p>
                        </div>

                        <div className="rounded-lg bg-muted p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Expected APY
                            </span>
                            <span className="font-medium text-green-600">
                              {
                                offerings.find((o) => o.id === selectedOffering)
                                  ?.rate
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Duration
                            </span>
                            <span className="font-medium">
                              {
                                offerings.find((o) => o.id === selectedOffering)
                                  ?.duration
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Min Amount
                            </span>
                            <span className="font-medium">
                              {
                                offerings.find((o) => o.id === selectedOffering)
                                  ?.minAmount
                              }{" "}
                              mCKB
                            </span>
                          </div>
                        </div>

                        <Button className="w-full" size="lg">
                          Accept Mining Offering
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - My Position */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Position</CardTitle>
                <CardDescription>Current mining provider status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Collateral Staked
                    </span>
                    <span className="font-medium">15,000 CKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">mCKB Debt</span>
                    <span className="font-medium">8,108 mCKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Individual ICR
                    </span>
                    <span className="font-medium text-green-600">185%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Mining Rewards
                    </span>
                    <span className="font-medium text-green-600">
                      1,245.67 CKB
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Health Status</span>
                  </div>
                  <Progress value={85} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Safe - Well above liquidation threshold (150%)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Add Collateral
                  </Button>
                  <Button variant="outline" size="sm">
                    Repay Debt
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Minimum ICR
                  </span>
                  <span className="text-sm font-medium">150%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Offering Fee
                  </span>
                  <span className="text-sm font-medium">0.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Active Offerings
                  </span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Avg Mining APY
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    3.4%
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
