"use client";

import { useMemo, useState, useEffect } from "react";
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
import { TrendingUp, Zap, Coins, RefreshCw, RotateCcw } from "lucide-react";
import { useComineOracle } from "@/hooks/use-comine-oracle";

export default function EarnPage() {
  const [liquidityToken, setLiquidityToken] = useState("iCKB");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [comineStakeAmount, setComineStakeAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  // Mock current balances and staked amounts
  const currentBalances = {
    iCKB: 10_000,
    CKB: 8_500,
    mCKB: 5_200,
  };
  const currentStakedLiquidity = {
    iCKB: 480_000,
    CKB: 320_000,
    mCKB: 150_000,
  };
  const currentStakedComine = 18_450;
  const availableComine = 24_500;

  // Mock liquidation participation data
  const liquidationData = {
    totalDebtLiquidated: 125_000, // Total debt liquidated by this staker
    totalCollateralsAcquired: 142_500, // Total collaterals acquired
    netReward: 17_500, // Difference (collaterals - consumed liquidity)
    participationCount: 8, // Number of liquidations participated
  };

  const issuance = 12_500_000;
  const supply = 5_200_000;
  const impliedPrice = issuance / supply;

  // Mock $COMINE price in USD (for oracle display)
  const [cominePriceUsd, setCominePriceUsd] = useState<number | null>(null);
  const [cominePriceUpdatedAt, setCominePriceUpdatedAt] = useState<Date | null>(
    null
  );

  // Use mock oracle for $COMINE price (in CKB)
  const {
    price: oraclePrice,
    lastUpdate,
    isLoading: oracleLoading,
  } = useComineOracle(impliedPrice);
  const cominePrice = oraclePrice;

  // Mock $COMINE price in USD - simulate price updates
  useEffect(() => {
    // Set initial mock price (e.g., $0.025 per $COMINE)
    const initialPrice = 0.025;
    setCominePriceUsd(initialPrice);
    setCominePriceUpdatedAt(new Date());

    // Simulate price updates every 60 seconds with small variations
    const intervalId = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.002; // ±$0.001 variation
      const newPrice = Math.max(0.02, Math.min(0.03, initialPrice + variation));
      setCominePriceUsd(newPrice);
      setCominePriceUpdatedAt(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Mock protocol data
  const totalStakedLiquidity = 15_000_000; // Total CKB equivalent staked
  const totalStakedComine = 2_500_000; // Total $COMINE staked
  const annualSecondaryIssuance = 1_500_000; // Annual $COMINE issuance
  const annualComineStakingRewards = 300_000; // Annual $COMINE for staking $COMINE

  const estimatedStake = useMemo(() => {
    const amount = Number(buyAmount || 0);
    if (!amount || !cominePrice) {
      return 0;
    }
    return amount / cominePrice;
  }, [buyAmount, cominePrice]);

  // Calculate total staked amount from input (input shows new total)
  const totalStakedLiquidityAmount = useMemo(() => {
    return Number(liquidityAmount || 0);
  }, [liquidityAmount]);

  // Calculate change amount for slider (slider uses difference)
  const liquidityChangeAmount = useMemo(() => {
    const current =
      currentStakedLiquidity[
        liquidityToken as keyof typeof currentStakedLiquidity
      ] || 0;
    const newTotal = Number(liquidityAmount || 0);
    return newTotal - current;
  }, [liquidityAmount, liquidityToken, currentStakedLiquidity]);

  // Calculate estimated rewards based on staked liquidity
  const estimatedRewards = useMemo(() => {
    if (
      !totalStakedLiquidityAmount ||
      totalStakedLiquidityAmount <= 0 ||
      !totalStakedLiquidity ||
      !cominePrice
    ) {
      return {
        share: 0,
        annualComine: 0,
        annualValue: 0,
        apy: 0,
      };
    }

    // Calculate share of total staked liquidity
    const share = (totalStakedLiquidityAmount / totalStakedLiquidity) * 100;

    // Calculate estimated $COMINE per year based on share
    const annualComine = (share / 100) * annualSecondaryIssuance;

    // Calculate annual value in CKB based on oracle price
    const annualValue = annualComine * cominePrice;

    // Calculate APY: (annual value / staked amount) * 100
    const apy =
      totalStakedLiquidityAmount > 0
        ? (annualValue / totalStakedLiquidityAmount) * 100
        : 0;

    return {
      share,
      annualComine,
      annualValue,
      apy,
    };
  }, [
    totalStakedLiquidityAmount,
    totalStakedLiquidity,
    annualSecondaryIssuance,
    cominePrice,
  ]);

  // Calculate total staked $COMINE from input (input shows new total)
  const totalStakedComineAmount = useMemo(() => {
    return Number(comineStakeAmount || 0);
  }, [comineStakeAmount]);

  // Calculate change amount for slider (slider uses difference)
  const comineChangeAmount = useMemo(() => {
    const current = currentStakedComine;
    const newTotal = Number(comineStakeAmount || 0);
    return newTotal - current;
  }, [comineStakeAmount, currentStakedComine]);

  // Calculate estimated rewards for staking $COMINE
  const estimatedComineRewards = useMemo(() => {
    if (
      !totalStakedComineAmount ||
      totalStakedComineAmount <= 0 ||
      !totalStakedComine ||
      !cominePrice
    ) {
      return {
        share: 0,
        annualComine: 0,
        annualValue: 0,
        apy: 0,
      };
    }

    // Calculate share of total staked $COMINE
    const share = (totalStakedComineAmount / totalStakedComine) * 100;

    // Calculate estimated $COMINE per year based on share
    const annualComine = (share / 100) * annualComineStakingRewards;

    // Calculate annual value in CKB based on oracle price
    const annualValue = annualComine * cominePrice;

    // Calculate APY: (annual value / staked amount value) * 100
    const stakedValue = totalStakedComineAmount * cominePrice;
    const apy = stakedValue > 0 ? (annualValue / stakedValue) * 100 : 0;

    return {
      share,
      annualComine,
      annualValue,
      apy,
    };
  }, [
    totalStakedComineAmount,
    totalStakedComine,
    annualComineStakingRewards,
    cominePrice,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Earn</h2>
          <p className="text-muted-foreground">
            Stake CKB for liquidity to earn $COMINE, or stake $COMINE to earn
            more $COMINE. Rewards are estimated and may vary.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="rounded-full border border-border px-3 py-1">
              $COMINE Oracle:{" "}
              {cominePriceUsd !== null ? `$${cominePriceUsd.toFixed(4)}` : "—"}
            </div>
            {cominePriceUpdatedAt && (
              <span>Updated {cominePriceUpdatedAt.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stake Liquidity</CardTitle>
                <CardDescription>
                  Stake iCKB, CKB, or mCKB to earn $COMINE rewards.
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
                      {token} (
                      {currentStakedLiquidity[
                        token as keyof typeof currentStakedLiquidity
                      ].toLocaleString()}
                      )
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="liquidity-amount">
                      Total Staked ({liquidityToken})
                    </Label>
                    <div className="flex justify-between text-xs">
                      <p className="text-muted-foreground">
                        Currently Staked:{" "}
                        <span className="font-medium">
                          {currentStakedLiquidity[
                            liquidityToken as keyof typeof currentStakedLiquidity
                          ].toLocaleString()}{" "}
                          {liquidityToken}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Available:{" "}
                        <span className="font-medium">
                          {currentBalances[
                            liquidityToken as keyof typeof currentBalances
                          ].toLocaleString()}{" "}
                          {liquidityToken}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 px-1 relative">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>
                        {(
                          currentStakedLiquidity[
                            liquidityToken as keyof typeof currentStakedLiquidity
                          ] +
                          currentBalances[
                            liquidityToken as keyof typeof currentBalances
                          ]
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 w-24">
                        <Input
                          id="liquidity-amount"
                          type="number"
                          step="1"
                          placeholder="0"
                          value={
                            liquidityAmount ||
                            currentStakedLiquidity[
                              liquidityToken as keyof typeof currentStakedLiquidity
                            ]
                          }
                          onChange={(e) => setLiquidityAmount(e.target.value)}
                          className="text-center px-2 py-1 text-sm h-8"
                        />
                      </div>
                      <Slider
                        value={[
                          Number(
                            liquidityAmount ||
                              currentStakedLiquidity[
                                liquidityToken as keyof typeof currentStakedLiquidity
                              ]
                          ),
                        ]}
                        onValueChange={(value) =>
                          setLiquidityAmount(value[0].toString())
                        }
                        min={0}
                        max={
                          currentStakedLiquidity[
                            liquidityToken as keyof typeof currentStakedLiquidity
                          ] +
                          currentBalances[
                            liquidityToken as keyof typeof currentBalances
                          ]
                        }
                        step={Math.max(
                          1,
                          Math.floor(
                            (currentBalances[
                              liquidityToken as keyof typeof currentBalances
                            ] +
                              currentStakedLiquidity[
                                liquidityToken as keyof typeof currentStakedLiquidity
                              ]) /
                              100
                          )
                        )}
                        className="w-full"
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setLiquidityAmount(
                              currentStakedLiquidity[
                                liquidityToken as keyof typeof currentStakedLiquidity
                              ].toString()
                            )
                          }
                          className="h-7 px-2 text-xs"
                          disabled={
                            Number(
                              liquidityAmount ||
                                currentStakedLiquidity[
                                  liquidityToken as keyof typeof currentStakedLiquidity
                                ]
                            ) ===
                            currentStakedLiquidity[
                              liquidityToken as keyof typeof currentStakedLiquidity
                            ]
                          }
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>
                        {(
                          currentStakedLiquidity[
                            liquidityToken as keyof typeof currentStakedLiquidity
                          ] +
                          currentBalances[
                            liquidityToken as keyof typeof currentBalances
                          ]
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {liquidityAmount &&
                    Number(liquidityAmount) !==
                      currentStakedLiquidity[
                        liquidityToken as keyof typeof currentStakedLiquidity
                      ] && (
                      <p className="text-xs font-medium text-primary">
                        Change:{" "}
                        {liquidityChangeAmount > 0 ? (
                          <span className="text-green-600">
                            +{liquidityChangeAmount.toLocaleString()}{" "}
                            {liquidityToken}
                          </span>
                        ) : (
                          <span className="text-red-600">
                            {liquidityChangeAmount.toLocaleString()}{" "}
                            {liquidityToken}
                          </span>
                        )}
                      </p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Estimated Rewards</span>
                    </div>
                    {totalStakedLiquidityAmount > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Share of Issuance
                            </p>
                            <p className="text-lg font-bold text-primary">
                              {estimatedRewards.share.toFixed(4)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              $COMINE/Year
                            </p>
                            <p className="text-lg font-bold text-primary">
                              {estimatedRewards.annualComine.toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Estimated APY
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              {estimatedRewards.apy.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-primary/20">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Estimated Annual Value
                            </span>
                            <span className="font-semibold">
                              {estimatedRewards.annualValue.toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}{" "}
                              CKB
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          Enter an amount to see estimated rewards
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground pt-2 text-center">
                      * Rewards are estimated based on current share, secondary
                      issuance, and oracle price. Actual rewards may vary.
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Liquidation Participation
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                          Staked liquidity can participate in liquidations.
                          Rewards are the difference between liquidated
                          collaterals and consumed staked liquidity.
                        </p>
                        <div className="space-y-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-700 dark:text-blue-300">
                              Total Debt Liquidated:
                            </span>
                            <span className="font-semibold text-blue-800 dark:text-blue-200">
                              {liquidationData.totalDebtLiquidated.toLocaleString()}{" "}
                              CKB
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-700 dark:text-blue-300">
                              Collaterals Acquired:
                            </span>
                            <span className="font-semibold text-blue-800 dark:text-blue-200">
                              {liquidationData.totalCollateralsAcquired.toLocaleString()}{" "}
                              CKB
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-700 dark:text-blue-300">
                              Net Reward:
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              +{liquidationData.netReward.toLocaleString()} CKB
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-700 dark:text-blue-300">
                              Participations:
                            </span>
                            <span className="font-semibold text-blue-800 dark:text-blue-200">
                              {liquidationData.participationCount} liquidations
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={
                    !liquidityAmount ||
                    Number(liquidityAmount) ===
                      currentStakedLiquidity[
                        liquidityToken as keyof typeof currentStakedLiquidity
                      ] ||
                    Number(liquidityAmount) < 0 ||
                    Number(liquidityAmount) >
                      currentStakedLiquidity[
                        liquidityToken as keyof typeof currentStakedLiquidity
                      ] +
                        currentBalances[
                          liquidityToken as keyof typeof currentBalances
                        ]
                  }
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {currentStakedLiquidity[
                    liquidityToken as keyof typeof currentStakedLiquidity
                  ] === 0
                    ? "Stake"
                    : "Adjust Stake"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stake $COMINE</CardTitle>
                <CardDescription>
                  Stake $COMINE to earn more $COMINE, fee share, and governance
                  boosts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="comine-stake">Total Staked ($COMINE)</Label>
                    <div className="flex justify-between text-xs">
                      <p className="text-muted-foreground">
                        Currently Staked:{" "}
                        <span className="font-medium">
                          {currentStakedComine.toLocaleString()} $COMINE
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Available:{" "}
                        <span className="font-medium">
                          {availableComine.toLocaleString()} $COMINE
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 px-1 relative">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>
                        {(
                          currentStakedComine + availableComine
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 w-24">
                        <Input
                          id="comine-stake"
                          type="number"
                          step="1"
                          placeholder="0"
                          value={comineStakeAmount || currentStakedComine}
                          onChange={(e) => setComineStakeAmount(e.target.value)}
                          className="text-center px-2 py-1 text-sm h-8"
                        />
                      </div>
                      <Slider
                        value={[
                          Number(comineStakeAmount || currentStakedComine),
                        ]}
                        onValueChange={(value) =>
                          setComineStakeAmount(value[0].toString())
                        }
                        min={0}
                        max={currentStakedComine + availableComine}
                        step={Math.max(
                          1,
                          Math.floor(
                            (availableComine + currentStakedComine) / 100
                          )
                        )}
                        className="w-full"
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setComineStakeAmount(currentStakedComine.toString())
                          }
                          className="h-7 px-2 text-xs"
                          disabled={
                            Number(comineStakeAmount || currentStakedComine) ===
                            currentStakedComine
                          }
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>
                        {(
                          currentStakedComine + availableComine
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {comineStakeAmount &&
                    Number(comineStakeAmount) !== currentStakedComine && (
                      <p className="text-xs font-medium text-primary">
                        Change:{" "}
                        {comineChangeAmount > 0 ? (
                          <span className="text-green-600">
                            +{comineChangeAmount.toLocaleString()} $COMINE
                          </span>
                        ) : (
                          <span className="text-red-600">
                            {comineChangeAmount.toLocaleString()} $COMINE
                          </span>
                        )}
                      </p>
                    )}
                </div>

                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Estimated Rewards</span>
                  </div>
                  {totalStakedComineAmount > 0 ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Share of Pool
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {estimatedComineRewards.share.toFixed(4)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            $COMINE/Year
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {estimatedComineRewards.annualComine.toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 2,
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Estimated APY
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {estimatedComineRewards.apy.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-primary/20">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Estimated Annual Value
                          </span>
                          <span className="font-semibold">
                            {estimatedComineRewards.annualValue.toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            CKB
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Enter an amount to see estimated rewards
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground pt-2 text-center">
                    * Rewards are estimated based on current share, staking
                    pool, and oracle price. Actual rewards may vary.
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled={
                    !comineStakeAmount ||
                    Number(comineStakeAmount) === currentStakedComine ||
                    Number(comineStakeAmount) < 0 ||
                    Number(comineStakeAmount) >
                      currentStakedComine + availableComine
                  }
                >
                  {Number(currentStakedComine) === 0 ? "Stake" : "Adjust Stake"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Buy Staked $COMINE</CardTitle>
                <CardDescription>
                  Price from oracle feed. Updates every 30 seconds.
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
                    <span className="text-muted-foreground">Implied Price</span>
                    <span className="font-semibold">
                      {impliedPrice.toFixed(4)} CKB
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Oracle Price
                        {oracleLoading && (
                          <RefreshCw className="inline-block ml-1 h-3 w-3 animate-spin" />
                        )}
                      </span>
                      <span className="font-semibold text-primary">
                        {cominePrice.toFixed(4)} CKB
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last update: {lastUpdate.toLocaleTimeString()}
                    </p>
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
                  <span className="font-semibold">
                    {currentStakedLiquidity.CKB.toLocaleString()} CKB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    $COMINE Staked
                  </span>
                  <span className="font-semibold">
                    {currentStakedComine.toLocaleString()} $COMINE
                  </span>
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
