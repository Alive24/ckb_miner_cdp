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
  const [icbkAmount, setIcbkAmount] = useState("");
  const [ckbAmount, setCkbAmount] = useState("");
  const [mckbAmount, setMckbAmount] = useState("");
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

  // CKB price in USD (for calculating $COMINE USD value)
  const [ckbPriceUsd, setCkbPriceUsd] = useState<number | null>(null);
  const [ckbPriceUpdatedAt, setCkbPriceUpdatedAt] = useState<Date | null>(null);

  // Use mock oracle for $COMINE price (in CKB)
  const {
    price: oraclePrice,
    lastUpdate,
    isLoading: oracleLoading,
  } = useComineOracle(impliedPrice);
  const cominePrice = oraclePrice;

  // Calculate estimated $COMINE price in USD based on CKB price
  const cominePriceUsd = useMemo(() => {
    if (!cominePrice || !ckbPriceUsd) return null;
    return cominePrice * ckbPriceUsd;
  }, [cominePrice, ckbPriceUsd]);

  // Fetch CKB price in USD
  useEffect(() => {
    let isMounted = true;

    const fetchCkbPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=nervos-network&vs_currencies=usd"
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        const price = data?.["nervos-network"]?.usd;
        if (isMounted && typeof price === "number") {
          setCkbPriceUsd(price);
          setCkbPriceUpdatedAt(new Date());
        }
      } catch {
        // Ignore oracle errors to keep UI responsive.
      }
    };

    fetchCkbPrice();
    const intervalId = setInterval(fetchCkbPrice, 60000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
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

  // Calculate total staked amount from all three tokens (input shows new total)
  const totalStakedLiquidityAmount = useMemo(() => {
    const icbk = Number(icbkAmount || currentStakedLiquidity.iCKB);
    const ckb = Number(ckbAmount || currentStakedLiquidity.CKB);
    const mckb = Number(mckbAmount || currentStakedLiquidity.mCKB);
    return icbk + ckb + mckb;
  }, [icbkAmount, ckbAmount, mckbAmount]);

  // Calculate change amounts for each token
  const icbkChangeAmount = useMemo(() => {
    const current = currentStakedLiquidity.iCKB;
    const newTotal = Number(icbkAmount || current);
    return newTotal - current;
  }, [icbkAmount]);

  const ckbChangeAmount = useMemo(() => {
    const current = currentStakedLiquidity.CKB;
    const newTotal = Number(ckbAmount || current);
    return newTotal - current;
  }, [ckbAmount]);

  const mckbChangeAmount = useMemo(() => {
    const current = currentStakedLiquidity.mCKB;
    const newTotal = Number(mckbAmount || current);
    return newTotal - current;
  }, [mckbAmount]);

  // Helper function to calculate input width based on total amount
  const getInputWidth = (totalAmount: number) => {
    const digits = Math.floor(Math.log10(Math.max(1, totalAmount))) + 1;
    // Base width + padding for each digit, with minimum width
    const baseWidth = 60; // Base width in pixels
    const digitWidth = 8; // Approximate width per digit
    const minWidth = 80;
    const maxWidth = 200;
    const calculatedWidth = baseWidth + digits * digitWidth;
    return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
  };

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
              {cominePrice !== null ? `${cominePrice.toFixed(4)} CKB` : "—"}
              {cominePriceUsd !== null && (
                <span className="ml-2 text-muted-foreground">
                  (≈ ${cominePriceUsd.toFixed(4)})
                </span>
              )}
            </div>
            {lastUpdate && (
              <span>Updated {lastUpdate.toLocaleTimeString()}</span>
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
                {/* iCKB Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <p className="text-muted-foreground">
                      Currently Staked:{" "}
                      <span className="font-medium">
                        {currentStakedLiquidity.iCKB.toLocaleString()} iCKB
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Available:{" "}
                      <span className="font-medium">
                        {currentBalances.iCKB.toLocaleString()} iCKB
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold min-w-[3rem]">
                      iCKB
                    </span>
                    <div className="flex-1 space-y-2 px-1 relative">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>
                          {(
                            currentStakedLiquidity.iCKB + currentBalances.iCKB
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          className="absolute top-0 left-1/2 -translate-y-full mb-3 flex items-center gap-1"
                          style={{
                            transform: "translateX(calc(-50% - 4px))",
                            paddingTop: "4px",
                            paddingBottom: "4px",
                          }}
                        >
                          <Input
                            id="icbk-amount"
                            type="number"
                            step="1"
                            placeholder="0"
                            max={
                              currentStakedLiquidity.iCKB + currentBalances.iCKB
                            }
                            value={icbkAmount || currentStakedLiquidity.iCKB}
                            onChange={(e) => {
                              const value = e.target.value;
                              const max =
                                currentStakedLiquidity.iCKB +
                                currentBalances.iCKB;
                              if (value === "" || value === "-") {
                                setIcbkAmount(value);
                              } else {
                                const numValue = Number(value);
                                if (
                                  !isNaN(numValue) &&
                                  numValue >= 0 &&
                                  numValue <= max
                                ) {
                                  setIcbkAmount(value);
                                } else if (numValue > max) {
                                  setIcbkAmount(max.toString());
                                }
                              }
                            }}
                            className="text-right px-2 py-1 text-sm h-8 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
                            style={{
                              width: `${getInputWidth(
                                currentStakedLiquidity.iCKB +
                                  currentBalances.iCKB
                              )}px`,
                            }}
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap mr-2 justify-end items-center">
                            iCKB
                          </span>
                          <span
                            className={`text-xs whitespace-nowrap ${
                              icbkChangeAmount > 0
                                ? "text-green-600"
                                : icbkChangeAmount < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                            style={{ minWidth: "60px" }}
                          >
                            ({icbkChangeAmount > 0 ? "+" : ""}
                            {icbkChangeAmount.toLocaleString()})
                          </span>
                        </div>
                        <Slider
                          value={[
                            Number(icbkAmount || currentStakedLiquidity.iCKB),
                          ]}
                          onValueChange={(value) =>
                            setIcbkAmount(value[0].toString())
                          }
                          min={0}
                          max={
                            currentStakedLiquidity.iCKB + currentBalances.iCKB
                          }
                          step={Math.max(
                            1,
                            Math.floor(
                              (currentBalances.iCKB +
                                currentStakedLiquidity.iCKB) /
                                100
                            )
                          )}
                          className="w-full my-0.5"
                          currentValue={currentStakedLiquidity.iCKB}
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setIcbkAmount(
                                currentStakedLiquidity.iCKB.toString()
                              )
                            }
                            className="h-7 px-2 text-xs"
                            disabled={
                              Number(
                                icbkAmount || currentStakedLiquidity.iCKB
                              ) === currentStakedLiquidity.iCKB
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
                            currentStakedLiquidity.iCKB + currentBalances.iCKB
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CKB Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <p className="text-muted-foreground">
                      Currently Staked:{" "}
                      <span className="font-medium">
                        {currentStakedLiquidity.CKB.toLocaleString()} CKB
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Available:{" "}
                      <span className="font-medium">
                        {currentBalances.CKB.toLocaleString()} CKB
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold min-w-[3rem]">
                      CKB
                    </span>
                    <div className="flex-1 space-y-2 px-1 relative">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>
                          {(
                            currentStakedLiquidity.CKB + currentBalances.CKB
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          className="absolute top-0 left-1/2 -translate-y-full mb-3 flex items-center gap-1"
                          style={{
                            transform: "translateX(calc(-50% - 4px))",
                            paddingTop: "4px",
                            paddingBottom: "4px",
                          }}
                        >
                          <Input
                            id="ckb-amount"
                            type="number"
                            step="1"
                            placeholder="0"
                            max={
                              currentStakedLiquidity.CKB + currentBalances.CKB
                            }
                            value={ckbAmount || currentStakedLiquidity.CKB}
                            onChange={(e) => {
                              const value = e.target.value;
                              const max =
                                currentStakedLiquidity.CKB +
                                currentBalances.CKB;
                              if (value === "" || value === "-") {
                                setCkbAmount(value);
                              } else {
                                const numValue = Number(value);
                                if (
                                  !isNaN(numValue) &&
                                  numValue >= 0 &&
                                  numValue <= max
                                ) {
                                  setCkbAmount(value);
                                } else if (numValue > max) {
                                  setCkbAmount(max.toString());
                                }
                              }
                            }}
                            className="text-right px-2 py-1 text-sm h-8 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
                            style={{
                              width: `${getInputWidth(
                                currentStakedLiquidity.CKB + currentBalances.CKB
                              )}px`,
                            }}
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap mr-2">
                            CKB
                          </span>
                          <span
                            className={`text-xs whitespace-nowrap ${
                              ckbChangeAmount > 0
                                ? "text-green-600"
                                : ckbChangeAmount < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                            style={{ minWidth: "60px" }}
                          >
                            ({ckbChangeAmount > 0 ? "+" : ""}
                            {ckbChangeAmount.toLocaleString()})
                          </span>
                        </div>
                        <Slider
                          value={[
                            Number(ckbAmount || currentStakedLiquidity.CKB),
                          ]}
                          onValueChange={(value) =>
                            setCkbAmount(value[0].toString())
                          }
                          min={0}
                          max={currentStakedLiquidity.CKB + currentBalances.CKB}
                          step={Math.max(
                            1,
                            Math.floor(
                              (currentBalances.CKB +
                                currentStakedLiquidity.CKB) /
                                100
                            )
                          )}
                          className="w-full my-0.5"
                          currentValue={currentStakedLiquidity.CKB}
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCkbAmount(
                                currentStakedLiquidity.CKB.toString()
                              )
                            }
                            className="h-7 px-2 text-xs"
                            disabled={
                              Number(
                                ckbAmount || currentStakedLiquidity.CKB
                              ) === currentStakedLiquidity.CKB
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
                            currentStakedLiquidity.CKB + currentBalances.CKB
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* mCKB Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <p className="text-muted-foreground">
                      Currently Staked:{" "}
                      <span className="font-medium">
                        {currentStakedLiquidity.mCKB.toLocaleString()} mCKB
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Available:{" "}
                      <span className="font-medium">
                        {currentBalances.mCKB.toLocaleString()} mCKB
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold min-w-[3rem]">
                      mCKB
                    </span>
                    <div className="flex-1 space-y-2 px-1 relative">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>
                          {(
                            currentStakedLiquidity.mCKB + currentBalances.mCKB
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          className="absolute top-0 left-1/2 -translate-y-full mb-3 flex items-center gap-1"
                          style={{
                            transform: "translateX(calc(-50% - 4px))",
                            paddingTop: "4px",
                            paddingBottom: "4px",
                          }}
                        >
                          <Input
                            id="mckb-amount"
                            type="number"
                            step="1"
                            placeholder="0"
                            max={
                              currentStakedLiquidity.mCKB + currentBalances.mCKB
                            }
                            value={mckbAmount || currentStakedLiquidity.mCKB}
                            onChange={(e) => {
                              const value = e.target.value;
                              const max =
                                currentStakedLiquidity.mCKB +
                                currentBalances.mCKB;
                              if (value === "" || value === "-") {
                                setMckbAmount(value);
                              } else {
                                const numValue = Number(value);
                                if (
                                  !isNaN(numValue) &&
                                  numValue >= 0 &&
                                  numValue <= max
                                ) {
                                  setMckbAmount(value);
                                } else if (numValue > max) {
                                  setMckbAmount(max.toString());
                                }
                              }
                            }}
                            className="text-right px-2 py-1 text-sm h-8 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
                            style={{
                              width: `${getInputWidth(
                                currentStakedLiquidity.mCKB +
                                  currentBalances.mCKB
                              )}px`,
                            }}
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap mr-2">
                            mCKB
                          </span>
                          <span
                            className={`text-xs whitespace-nowrap ${
                              mckbChangeAmount > 0
                                ? "text-green-600"
                                : mckbChangeAmount < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                            style={{ minWidth: "60px" }}
                          >
                            ({mckbChangeAmount > 0 ? "+" : ""}
                            {mckbChangeAmount.toLocaleString()})
                          </span>
                        </div>
                        <Slider
                          value={[
                            Number(mckbAmount || currentStakedLiquidity.mCKB),
                          ]}
                          onValueChange={(value) =>
                            setMckbAmount(value[0].toString())
                          }
                          min={0}
                          max={
                            currentStakedLiquidity.mCKB + currentBalances.mCKB
                          }
                          step={Math.max(
                            1,
                            Math.floor(
                              (currentBalances.mCKB +
                                currentStakedLiquidity.mCKB) /
                                100
                            )
                          )}
                          className="w-full my-0.5"
                          currentValue={currentStakedLiquidity.mCKB}
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setMckbAmount(
                                currentStakedLiquidity.mCKB.toString()
                              )
                            }
                            className="h-7 px-2 text-xs"
                            disabled={
                              Number(
                                mckbAmount || currentStakedLiquidity.mCKB
                              ) === currentStakedLiquidity.mCKB
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
                            currentStakedLiquidity.mCKB + currentBalances.mCKB
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={
                    (Number(icbkAmount || currentStakedLiquidity.iCKB) ===
                      currentStakedLiquidity.iCKB &&
                      Number(ckbAmount || currentStakedLiquidity.CKB) ===
                        currentStakedLiquidity.CKB &&
                      Number(mckbAmount || currentStakedLiquidity.mCKB) ===
                        currentStakedLiquidity.mCKB) ||
                    totalStakedLiquidityAmount < 0 ||
                    totalStakedLiquidityAmount >
                      currentStakedLiquidity.iCKB +
                        currentBalances.iCKB +
                        currentStakedLiquidity.CKB +
                        currentBalances.CKB +
                        currentStakedLiquidity.mCKB +
                        currentBalances.mCKB
                  }
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {totalStakedLiquidityAmount === 0 ? "Stake" : "Adjust Stake"}
                </Button>

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
                  <div className="space-y-3">
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
                    <div className="flex items-center gap-4">
                      <span className="text-base font-semibold min-w-[3rem]">
                        $COMINE
                      </span>
                      <div className="flex-1 space-y-2 px-1 relative">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>
                            {(
                              currentStakedComine + availableComine
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="relative">
                          <div
                            className="absolute top-0 left-1/2 -translate-y-full mb-3 flex items-center gap-1"
                            style={{
                              transform: "translateX(calc(-50% - 4px))",
                              paddingTop: "4px",
                              paddingBottom: "4px",
                            }}
                          >
                            <Input
                              id="comine-stake"
                              type="number"
                              step="1"
                              placeholder="0"
                              max={currentStakedComine + availableComine}
                              value={comineStakeAmount || currentStakedComine}
                              onChange={(e) => {
                                const value = e.target.value;
                                const max =
                                  currentStakedComine + availableComine;
                                if (value === "" || value === "-") {
                                  setComineStakeAmount(value);
                                } else {
                                  const numValue = Number(value);
                                  if (
                                    !isNaN(numValue) &&
                                    numValue >= 0 &&
                                    numValue <= max
                                  ) {
                                    setComineStakeAmount(value);
                                  } else if (numValue > max) {
                                    setComineStakeAmount(max.toString());
                                  }
                                }
                              }}
                              className="text-right px-2 py-1 text-sm h-8 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
                              style={{
                                width: `${getInputWidth(
                                  currentStakedComine + availableComine
                                )}px`,
                              }}
                            />
                            <span className="text-xs text-muted-foreground whitespace-nowrap mr-2 justify-end items-center">
                              $COMINE
                            </span>
                            <span
                              className={`text-xs whitespace-nowrap ${
                                comineChangeAmount > 0
                                  ? "text-green-600"
                                  : comineChangeAmount < 0
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                              }`}
                              style={{ minWidth: "60px" }}
                            >
                              ({comineChangeAmount > 0 ? "+" : ""}
                              {comineChangeAmount.toLocaleString()})
                            </span>
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
                            className="w-full my-0.5"
                            currentValue={currentStakedComine}
                          />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setComineStakeAmount(
                                  currentStakedComine.toString()
                                )
                              }
                              className="h-7 px-2 text-xs"
                              disabled={
                                Number(
                                  comineStakeAmount || currentStakedComine
                                ) === currentStakedComine
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
                    </div>
                  </div>
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
