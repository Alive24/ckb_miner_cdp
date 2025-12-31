"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function MiningRecruitingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOffering, setSelectedOffering] = useState<number | null>(null)

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
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Mining Recruiting</h2>
          <p className="text-muted-foreground">Browse and accept mining offerings from providers (sponsors)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                <CardDescription>Select an offering to participate in CKB mining as a sponsor</CardDescription>
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
                            <p className="font-mono text-sm font-medium">{offer.provider}</p>
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-500/10 text-green-600 border-green-500/20"
                            >
                              {offer.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Min Amount: {offer.minAmount} mCKB • Duration: {offer.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{offer.rate}</p>
                          <p className="text-xs text-muted-foreground">APY</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Volume</p>
                          <p className="text-sm font-medium">{offer.volume} mCKB</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Collateral Ratio</p>
                          <p className="text-sm font-medium">{offer.icr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Accept Offering */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accept Offering</CardTitle>
                <CardDescription>
                  {selectedOffering ? "Enter amount to sponsor" : "Select an offering to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOffering ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-amount">Sponsorship Amount (mCKB)</Label>
                      <Input id="sponsor-amount" type="number" placeholder="0.00" />
                      <p className="text-xs text-muted-foreground">Available: 5,000 mCKB</p>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expected APY</span>
                        <span className="font-medium text-green-600">
                          {offerings.find((o) => o.id === selectedOffering)?.rate}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">
                          {offerings.find((o) => o.id === selectedOffering)?.duration}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min Amount</span>
                        <span className="font-medium">
                          {offerings.find((o) => o.id === selectedOffering)?.minAmount} mCKB
                        </span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Accept Mining Offering
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select an offering from the list to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Market Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Offerings</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg APY</span>
                  <span className="text-sm font-medium text-green-600">3.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                  <span className="text-sm font-medium">8.5M mCKB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">24h Change</span>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2.4%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
