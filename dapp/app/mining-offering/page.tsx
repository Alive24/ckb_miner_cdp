"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function MiningOfferingPage() {
  const [collateralAmount, setCollateralAmount] = useState("")
  const [mintAmount, setMintAmount] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Mining Offering</h2>
          <p className="text-muted-foreground">Stake CKB collateral to create mining offerings and mint mCKB tokens</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Mining Offering Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Stake Collateral & Mint mCKB</CardTitle>
                <CardDescription>Lock CKB as collateral to participate in mining and mint mCKB tokens</CardDescription>
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
                  <p className="text-xs text-muted-foreground">Available: 10,000 CKB</p>
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
                  <p className="text-xs text-muted-foreground">Max mintable: 5,400 mCKB (based on 185% CR)</p>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Collateral Ratio</span>
                    <span className="font-medium">185%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Liquidation Price</span>
                    <span className="font-medium">$0.0089</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mining Offering Fee</span>
                    <span className="font-medium">0.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Annual Mining Yield</span>
                    <span className="font-medium text-green-600">3.2%</span>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-600">Important Information</p>
                      <p className="text-xs text-muted-foreground">
                        Your collateral will be locked and used for CKB mining. You must maintain a minimum 150%
                        collateral ratio to avoid liquidation. Mining rewards will be distributed based on your share of
                        the total mining pool.
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
                    <span className="text-muted-foreground">Collateral Staked</span>
                    <span className="font-medium">15,000 CKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">mCKB Debt</span>
                    <span className="font-medium">8,108 mCKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Individual ICR</span>
                    <span className="font-medium text-green-600">185%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mining Rewards</span>
                    <span className="font-medium text-green-600">1,245.67 CKB</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Health Status</span>
                  </div>
                  <Progress value={85} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Safe - Well above liquidation threshold (150%)</p>
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
                  <span className="text-sm text-muted-foreground">Minimum ICR</span>
                  <span className="text-sm font-medium">150%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Offering Fee</span>
                  <span className="text-sm font-medium">0.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Offerings</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Mining APY</span>
                  <span className="text-sm font-medium text-green-600">3.4%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
