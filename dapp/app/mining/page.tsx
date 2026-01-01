"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AlertCircle } from "lucide-react";

const PAGE_SIZE = 3;

const parseNumber = (value: string) =>
  Number(value.replace(/,/g, "").split(" ")[0] || 0);

const RepayOptions = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const options = [
    { value: "7", label: "7 days", fee: "1.2%" },
    { value: "14", label: "14 days", fee: "0.6%" },
    { value: "28", label: "28 days", fee: "0.3%" },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          type="button"
          className={`h-auto flex-col items-start p-3 text-left hover:border-primary ${
            selected === option.value ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => setSelected(option.value)}
        >
          <span className="font-semibold">{option.label}</span>
          <span className="text-xs text-muted-foreground">
            {option.fee} one-time fee
          </span>
        </Button>
      ))}
    </div>
  );
};

export default function MiningPage() {
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedRecruitingIds, setSelectedRecruitingIds] = useState<
    Set<number>
  >(new Set());
  const [offeringTarget, setOfferingTarget] = useState("");
  const [recruitingTarget, setRecruitingTarget] = useState("");
  const [offeringMaxPrice, setOfferingMaxPrice] = useState("");
  const [recruitingMaxPrice, setRecruitingMaxPrice] = useState("");
  const [offeringSelectMode, setOfferingSelectMode] = useState<
    "volume" | "maxPrice"
  >("volume");
  const [recruitingSelectMode, setRecruitingSelectMode] = useState<
    "volume" | "maxPrice"
  >("volume");
  const [offeringsPage, setOfferingsPage] = useState(1);
  const [recruitingsPage, setRecruitingsPage] = useState(1);
  const [offeringToken, setOfferingToken] = useState<string | null>(null);
  const [recruitingToken, setRecruitingToken] = useState<string | null>(null);
  const [ckbPriceUsd, setCkbPriceUsd] = useState<number | null>(null);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState<Date | null>(null);

  const tokenOptions = ["CKB", "RUSD", "USDT", "USDC"];

  const shouldShowUsd = (tokens: string[]) =>
    tokens.some((token) => token !== "CKB");

  const formatUsd = (value: number | null) =>
    value === null ? "—" : `$${value.toFixed(4)}`;

  const priceToUsd = (price: string) =>
    ckbPriceUsd ? parseNumber(price) * ckbPriceUsd : null;

  const formatCkb = (price: string) => `${parseNumber(price).toFixed(2)} CKB`;

  useEffect(() => {
    let isMounted = true;

    const fetchPrice = async () => {
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
          setPriceUpdatedAt(new Date());
        }
      } catch {
        // Ignore oracle errors to keep UI responsive.
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, 60000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const offerings = useMemo(
    () => [
      {
        id: 1,
        provider: "0x7a8b...3c4d",
        price: "0.95 CKB",
        priceMode: "CKB absolute price",
        volume: "50,000",
        volumeMode: "Absolute volume",
        icr: "195%",
        status: "active",
        tokens: ["CKB", "USDT"],
      },
      {
        id: 2,
        provider: "0x9f2e...1a5b",
        price: "0.97 CKB",
        priceMode: "Stable coin, percentage offset",
        volume: "75,000",
        volumeMode: "Absolute volume",
        icr: "210%",
        status: "active",
        tokens: ["CKB", "USDC"],
      },
      {
        id: 3,
        provider: "0x4c6d...8e2f",
        price: "0.92 CKB",
        priceMode: "CKB absolute price",
        volume: "100,000",
        volumeMode: "Target ICR",
        icr: "185%",
        status: "active",
        tokens: ["CKB", "RUSD", "USDT"],
      },
      {
        id: 6,
        provider: "0x2f1d...9b7c",
        price: "0.92 CKB",
        priceMode: "CKB absolute price",
        volume: "35,000",
        volumeMode: "Absolute volume",
        icr: "192%",
        status: "active",
        tokens: ["CKB", "USDT"],
      },
      {
        id: 4,
        provider: "0x1b3c...9d7e",
        price: "0.98 CKB",
        priceMode: "CKB absolute price",
        volume: "25,000",
        volumeMode: "Absolute volume",
        icr: "200%",
        status: "active",
        tokens: ["CKB", "USDC", "USDT"],
      },
      {
        id: 5,
        provider: "0x5e8f...2a1c",
        price: "0.94 CKB",
        priceMode: "Stable coin, absolute price",
        volume: "60,000",
        volumeMode: "Target ICR",
        icr: "188%",
        status: "active",
        tokens: ["CKB", "RUSD"],
      },
      {
        id: 7,
        provider: "0x7e1a...4d2f",
        price: "0.94 CKB",
        priceMode: "Stable coin, absolute price",
        volume: "22,000",
        volumeMode: "Absolute volume",
        icr: "197%",
        status: "active",
        tokens: ["CKB", "RUSD"],
      },
    ],
    []
  );

  const recruitings = useMemo(
    () => [
      {
        id: 101,
        sponsor: "0x8c3d...1f2a",
        price: "0.95 CKB",
        priceMode: "CKB absolute price",
        volume: "40,000",
        volumeMode: "Absolute volume",
        icr: "190%",
        status: "active",
        tokens: ["CKB", "USDT", "USDC"],
      },
      {
        id: 105,
        sponsor: "0x1c3e...6f8b",
        price: "0.95 CKB",
        priceMode: "CKB absolute price",
        volume: "18,000",
        volumeMode: "Absolute volume",
        icr: "198%",
        status: "active",
        tokens: ["CKB", "USDC"],
      },
      {
        id: 102,
        sponsor: "0xa2b1...7d9c",
        price: "0.97 CKB",
        priceMode: "Stable coin, percentage offset",
        volume: "85,000",
        volumeMode: "Target ICR",
        icr: "205%",
        status: "active",
        tokens: ["CKB", "RUSD"],
      },
      {
        id: 106,
        sponsor: "0x3b9e...2a6d",
        price: "0.97 CKB",
        priceMode: "Stable coin, percentage offset",
        volume: "26,000",
        volumeMode: "Absolute volume",
        icr: "201%",
        status: "active",
        tokens: ["CKB", "RUSD"],
      },
      {
        id: 103,
        sponsor: "0x6f2a...4c1e",
        price: "0.92 CKB",
        priceMode: "CKB absolute price",
        volume: "60,000",
        volumeMode: "Absolute volume",
        icr: "175%",
        status: "active",
        tokens: ["CKB", "USDT"],
      },
      {
        id: 104,
        sponsor: "0x9b7e...2d3f",
        price: "0.98 CKB",
        priceMode: "Stable coin, absolute price",
        volume: "30,000",
        volumeMode: "Absolute volume",
        icr: "220%",
        status: "active",
        tokens: ["CKB", "USDC"],
      },
    ],
    []
  );

  const lowestPriceOfferings = useMemo(() => {
    const filtered = offeringToken
      ? offerings.filter((offer) => offer.tokens.includes(offeringToken))
      : offerings;
    return [...filtered].sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
  }, [offerings, offeringToken]);

  const highestPriceRecruitings = useMemo(() => {
    const filtered = recruitingToken
      ? recruitings.filter((recruiting) =>
          recruiting.tokens.includes(recruitingToken)
        )
      : recruitings;
    return [...filtered].sort(
      (a, b) => parseFloat(b.price) - parseFloat(a.price)
    );
  }, [recruitings, recruitingToken]);

  const groupByPrice = <
    T extends { price: string; volume: string; tokens: string[] }
  >(
    list: T[]
  ) => {
    const groups = new Map<
      string,
      {
        priceLabel: string;
        priceValue: number;
        volume: number;
        tokens: Set<string>;
        items: T[];
      }
    >();

    list.forEach((item) => {
      const priceValue = parseNumber(item.price);
      const priceKey = priceValue.toFixed(2);
      const group = groups.get(priceKey) ?? {
        priceLabel: `${priceValue.toFixed(2)} CKB`,
        priceValue,
        volume: 0,
        tokens: new Set<string>(),
        items: [],
      };

      group.volume += parseNumber(item.volume);
      item.tokens.forEach((token) => group.tokens.add(token));
      group.items.push(item);
      groups.set(priceKey, group);
    });

    return Array.from(groups.values()).sort(
      (a, b) => a.priceValue - b.priceValue
    );
  };

  const groupedOfferings = useMemo(
    () => groupByPrice(lowestPriceOfferings),
    [lowestPriceOfferings]
  );

  const groupedRecruitings = useMemo(
    () =>
      groupByPrice(highestPriceRecruitings).sort(
        (a, b) => b.priceValue - a.priceValue
      ),
    [highestPriceRecruitings]
  );

  const offeringPriceRange = useMemo(() => {
    if (groupedOfferings.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = groupedOfferings.map((group) => group.priceValue);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [groupedOfferings]);

  const recruitingPriceRange = useMemo(() => {
    if (groupedRecruitings.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = groupedRecruitings.map((group) => group.priceValue);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [groupedRecruitings]);

  const totalOfferingVolume = groupedOfferings.reduce(
    (total, group) => total + group.volume,
    0
  );

  const totalRecruitingVolume = groupedRecruitings.reduce(
    (total, group) => total + group.volume,
    0
  );

  const pagedOfferings = groupedOfferings.slice(
    (offeringsPage - 1) * PAGE_SIZE,
    offeringsPage * PAGE_SIZE
  );

  const pagedRecruitings = groupedRecruitings.slice(
    (recruitingsPage - 1) * PAGE_SIZE,
    recruitingsPage * PAGE_SIZE
  );

  const offeringPages = Math.ceil(groupedOfferings.length / PAGE_SIZE);
  const recruitingPages = Math.ceil(groupedRecruitings.length / PAGE_SIZE);

  const selectedOfferings = offerings.filter((offer) =>
    selectedOfferingIds.has(offer.id)
  );

  const selectedRecruitings = recruitings.filter((recruiting) =>
    selectedRecruitingIds.has(recruiting.id)
  );

  const selectedOfferingVolume = selectedOfferings.reduce(
    (total, offer) => total + parseNumber(offer.volume),
    0
  );

  const selectedRecruitingVolume = selectedRecruitings.reduce(
    (total, recruiting) => total + parseNumber(recruiting.volume),
    0
  );

  const selectedOfferingsNeedUsd = selectedOfferings.some((offer) =>
    shouldShowUsd(offer.tokens)
  );
  const selectedRecruitingsNeedUsd = selectedRecruitings.some((recruiting) =>
    shouldShowUsd(recruiting.tokens)
  );

  const selectedOfferingAvgPrice =
    selectedOfferingVolume > 0
      ? selectedOfferings.reduce(
          (total, offer) =>
            total + parseNumber(offer.price) * parseNumber(offer.volume),
          0
        ) / selectedOfferingVolume
      : 0;

  const selectedRecruitingAvgPrice =
    selectedRecruitingVolume > 0
      ? selectedRecruitings.reduce(
          (total, recruiting) =>
            total +
            parseNumber(recruiting.price) * parseNumber(recruiting.volume),
          0
        ) / selectedRecruitingVolume
      : 0;

  const selectedOfferingAvgUsd =
    ckbPriceUsd && selectedOfferingAvgPrice
      ? selectedOfferingAvgPrice * ckbPriceUsd
      : null;

  const selectedRecruitingAvgUsd =
    ckbPriceUsd && selectedRecruitingAvgPrice
      ? selectedRecruitingAvgPrice * ckbPriceUsd
      : null;

  const autoSelect = (
    list: {
      volume: number;
      items: { id: number; volume: string }[];
    }[],
    targetAmount: string,
    setSelected: Dispatch<SetStateAction<Set<number>>>
  ) => {
    const target = parseNumber(targetAmount);
    if (!target) {
      return;
    }
    let remaining = target;
    const nextSelection = new Set<number>();
    for (const item of list) {
      if (remaining <= 0) {
        break;
      }
      if (remaining >= item.volume) {
        item.items.forEach((entry) => nextSelection.add(entry.id));
        remaining -= item.volume;
        continue;
      }

      const sortedItems = [...item.items].sort(
        (a, b) => parseNumber(a.volume) - parseNumber(b.volume)
      );
      for (const entry of sortedItems) {
        if (remaining <= 0) {
          break;
        }
        nextSelection.add(entry.id);
        remaining -= parseNumber(entry.volume);
      }
    }
    setSelected(nextSelection);
  };

  useEffect(() => {
    if (offeringSelectMode === "volume") {
      if (!offeringTarget) {
        setSelectedOfferingIds(new Set());
        return;
      }
      autoSelect(groupedOfferings, offeringTarget, setSelectedOfferingIds);
      return;
    }

    const maxPrice = parseNumber(offeringMaxPrice);
    if (!maxPrice) {
      setSelectedOfferingIds(new Set());
      return;
    }
    const nextSelection = new Set<number>();
    groupedOfferings
      .filter((group) => group.priceValue <= maxPrice)
      .forEach((group) =>
        group.items.forEach((item) => nextSelection.add(item.id))
      );
    setSelectedOfferingIds(nextSelection);
  }, [groupedOfferings, offeringMaxPrice, offeringSelectMode, offeringTarget]);

  useEffect(() => {
    if (recruitingSelectMode === "volume") {
      if (!recruitingTarget) {
        setSelectedRecruitingIds(new Set());
        return;
      }
      autoSelect(
        groupedRecruitings,
        recruitingTarget,
        setSelectedRecruitingIds
      );
      return;
    }

    const maxPrice = parseNumber(recruitingMaxPrice);
    if (!maxPrice) {
      setSelectedRecruitingIds(new Set());
      return;
    }
    const nextSelection = new Set<number>();
    groupedRecruitings
      .filter((group) => group.priceValue <= maxPrice)
      .forEach((group) =>
        group.items.forEach((item) => nextSelection.add(item.id))
      );
    setSelectedRecruitingIds(nextSelection);
  }, [
    groupedRecruitings,
    recruitingMaxPrice,
    recruitingSelectMode,
    recruitingTarget,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Mining Marketplace</h2>
          <p className="text-muted-foreground">
            Compare lowest-price offerings with highest-price recruitings, then
            manage your positions below.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="rounded-full border border-border px-3 py-1">
              CKB Oracle: {formatUsd(ckbPriceUsd)}
            </div>
            {priceUpdatedAt && (
              <span>Updated {priceUpdatedAt.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle>Lowest Price Mining Offerings</CardTitle>
              <CardDescription>
                Providers offering the most competitive prices per mCKB.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-[640px] flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {tokenOptions.map((token) => (
                    <Button
                      key={`offering-${token}`}
                      type="button"
                      variant={offeringToken === token ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setOfferingToken((current) =>
                          current === token ? null : token
                        )
                      }
                    >
                      {token}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-2">
                    <Label>Selection Mode</Label>
                    <Select
                      value={offeringSelectMode}
                      onValueChange={(value) =>
                        setOfferingSelectMode(value as "volume" | "maxPrice")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volume">
                          Select by total volume
                        </SelectItem>
                        <SelectItem value="maxPrice">
                          Select by maximum price
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="offering-target">
                      {offeringSelectMode === "volume"
                        ? "Target Volume (mCKB)"
                        : "Maximum Price (CKB)"}
                    </Label>
                    <Input
                      id="offering-target"
                      type="number"
                      step={offeringSelectMode === "volume" ? "1" : "0.01"}
                      placeholder={
                        offeringSelectMode === "volume" ? "50000" : "0.95"
                      }
                      value={
                        offeringSelectMode === "volume"
                          ? offeringTarget
                          : offeringMaxPrice
                      }
                      onChange={(e) =>
                        offeringSelectMode === "volume"
                          ? setOfferingTarget(e.target.value)
                          : setOfferingMaxPrice(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Selected: {selectedOfferings.length} offerings</span>
                <span>
                  Total volume: {selectedOfferingVolume.toLocaleString()} mCKB
                </span>
              </div>

              <div className="min-h-[420px] space-y-3">
                {pagedOfferings.map((group) => {
                  const groupIds = group.items.map((item) => item.id);
                  const isSelected = groupIds.every((id) =>
                    selectedOfferingIds.has(id)
                  );
                  const groupTokens = Array.from(group.tokens);
                  const groupUsd = ckbPriceUsd
                    ? group.priceValue * ckbPriceUsd
                    : null;
                  const showUsdTag = shouldShowUsd(groupTokens);
                  const volumeRatio = totalOfferingVolume
                    ? (group.volume / totalOfferingVolume) * 100
                    : 0;
                  const selectedGroupVolume = group.items.reduce(
                    (total, item) =>
                      selectedOfferingIds.has(item.id)
                        ? total + parseNumber(item.volume)
                        : total,
                    0
                  );
                  const selectedVolumeRatio = totalOfferingVolume
                    ? (selectedGroupVolume / totalOfferingVolume) * 100
                    : 0;
                  const isFullySelected =
                    group.volume > 0 && selectedGroupVolume === group.volume;
                  return (
                    <Dialog key={group.priceLabel}>
                      <DialogTrigger asChild>
                        <div
                          className={`relative cursor-pointer overflow-hidden rounded-lg border p-3 transition-all ${
                            isSelected
                              ? "border-primary shadow-sm"
                              : "border-border"
                          }`}
                        >
                          <div className="pointer-events-none absolute inset-y-0 left-0 w-full">
                            <div
                              className={`h-full ${
                                isFullySelected
                                  ? "bg-orange-500/20"
                                  : "bg-primary/5"
                              }`}
                              style={{ width: `${volumeRatio}%` }}
                            />
                            {!isFullySelected && selectedVolumeRatio > 0 && (
                              <div
                                className="absolute inset-y-0 left-0 h-full bg-orange-500/20"
                                style={{ width: `${selectedVolumeRatio}%` }}
                              />
                            )}
                          </div>
                          <div className="relative">
                            <div className="mt-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Price
                                </p>
                                <p className="text-xl font-semibold text-green-600">
                                  {group.priceLabel}
                                </p>
                                {showUsdTag && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatUsd(groupUsd)}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Volume
                                </p>
                                <p className="text-xl font-semibold">
                                  {group.volume.toLocaleString()} mCKB
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {groupTokens.map((token) => (
                                <Badge
                                  key={`${group.priceLabel}-${token}`}
                                  variant="secondary"
                                >
                                  {token}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Mining Offering Details</DialogTitle>
                          <DialogDescription>
                            {group.items.length} offerings at this price
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                          {group.items.map((offer) => {
                            const offerUsd = priceToUsd(offer.price);
                            return (
                              <div
                                key={`offer-detail-${offer.id}`}
                                className="rounded-lg border border-border p-3 space-y-2"
                              >
                                {shouldShowUsd(offer.tokens) && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Price (USD)
                                    </span>
                                    <span className="font-medium">
                                      {formatUsd(offerUsd)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Price (CKB)
                                  </span>
                                  <span className="font-medium">
                                    {formatCkb(offer.price)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Price Mode
                                  </span>
                                  <span className="font-medium">
                                    {offer.priceMode}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Volume
                                  </span>
                                  <span className="font-medium">
                                    {offer.volume} mCKB
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Volume Mode
                                  </span>
                                  <span className="font-medium">
                                    {offer.volumeMode}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Accepts
                                  </span>
                                  <span className="font-medium">
                                    {offer.tokens.join(", ")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Collateral Ratio
                                  </span>
                                  <span className="font-medium">
                                    {offer.icr}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <p className="text-xs text-muted-foreground">
                            Partial fills supported. Any remaining amount can be
                            filled across other offerings.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offeringsPage === 1}
                    onClick={() => setOfferingsPage((page) => page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {offeringsPage} of {offeringPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offeringsPage === offeringPages}
                    onClick={() => setOfferingsPage((page) => page + 1)}
                  >
                    Next
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Accept Selected Offerings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Offerings Acceptance</DialogTitle>
                      <DialogDescription>
                        Review the selected offerings and confirm your total
                        sponsorship amount.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected</span>
                        <span className="font-medium">
                          {selectedOfferings.length} offerings
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Average Price
                        </span>
                        <span className="font-medium">
                          {selectedOfferingAvgPrice.toFixed(2)} CKB
                        </span>
                      </div>
                      {selectedOfferingsNeedUsd && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Average Price (USD)
                          </span>
                          <span className="font-medium">
                            {formatUsd(selectedOfferingAvgUsd)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Volume
                        </span>
                        <span className="font-medium">
                          {selectedOfferingVolume.toLocaleString()} mCKB
                        </span>
                      </div>
                      <div className="rounded-lg border border-border p-3 space-y-3">
                        {selectedOfferings.map((offer) => {
                          const showUsd = shouldShowUsd(offer.tokens);
                          return (
                            <div
                              key={`confirm-offer-${offer.id}`}
                              className="flex items-start justify-between"
                            >
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {offer.provider}
                                </p>
                                <p className="text-sm font-medium">
                                  {formatCkb(offer.price)}
                                </p>
                                {showUsd && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatUsd(priceToUsd(offer.price))}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Volume
                                </p>
                                <p className="text-sm font-medium">
                                  {offer.volume} mCKB
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Partial fills are allowed. Any remaining amount can be
                        filled across other offerings.
                      </p>
                    </div>
                    <Button className="w-full">Confirm Acceptance</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle>Highest Price Mining Recruitings</CardTitle>
              <CardDescription>
                Sponsors willing to pay the most for future mining output.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-[640px] flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {tokenOptions.map((token) => (
                    <Button
                      key={`recruiting-${token}`}
                      type="button"
                      variant={
                        recruitingToken === token ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setRecruitingToken((current) =>
                          current === token ? null : token
                        )
                      }
                    >
                      {token}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-2">
                    <Label>Selection Mode</Label>
                    <Select
                      value={recruitingSelectMode}
                      onValueChange={(value) =>
                        setRecruitingSelectMode(value as "volume" | "maxPrice")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volume">
                          Select by total volume
                        </SelectItem>
                        <SelectItem value="maxPrice">
                          Select by maximum price
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="recruiting-target">
                      {recruitingSelectMode === "volume"
                        ? "Target Volume (mCKB)"
                        : "Maximum Price (CKB)"}
                    </Label>
                    <Input
                      id="recruiting-target"
                      type="number"
                      step={recruitingSelectMode === "volume" ? "1" : "0.01"}
                      placeholder={
                        recruitingSelectMode === "volume" ? "50000" : "0.95"
                      }
                      value={
                        recruitingSelectMode === "volume"
                          ? recruitingTarget
                          : recruitingMaxPrice
                      }
                      onChange={(e) =>
                        recruitingSelectMode === "volume"
                          ? setRecruitingTarget(e.target.value)
                          : setRecruitingMaxPrice(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Selected: {selectedRecruitings.length} recruitings</span>
                <span>
                  Total volume: {selectedRecruitingVolume.toLocaleString()} mCKB
                </span>
              </div>

              <div className="min-h-[420px] space-y-3">
                {pagedRecruitings.map((group) => {
                  const groupIds = group.items.map((item) => item.id);
                  const isSelected = groupIds.every((id) =>
                    selectedRecruitingIds.has(id)
                  );
                  const selectedGroupVolume = group.items.reduce(
                    (total, item) =>
                      selectedRecruitingIds.has(item.id)
                        ? total + parseNumber(item.volume)
                        : total,
                    0
                  );
                  const selectedVolumeRatio = totalRecruitingVolume
                    ? (selectedGroupVolume / totalRecruitingVolume) * 100
                    : 0;
                  const isFullySelected =
                    group.volume > 0 && selectedGroupVolume === group.volume;
                  const groupTokens = Array.from(group.tokens);
                  const groupUsd = ckbPriceUsd
                    ? group.priceValue * ckbPriceUsd
                    : null;
                  const showUsdTag = shouldShowUsd(groupTokens);
                  const volumeRatio = totalRecruitingVolume
                    ? (group.volume / totalRecruitingVolume) * 100
                    : 0;
                  return (
                    <Dialog key={group.priceLabel}>
                      <DialogTrigger asChild>
                        <div
                          className={`relative cursor-pointer overflow-hidden rounded-lg border p-3 transition-all ${
                            isSelected
                              ? "border-primary shadow-sm"
                              : "border-border"
                          }`}
                        >
                          <div className="pointer-events-none absolute inset-y-0 left-0 w-full">
                            <div
                              className={`h-full ${
                                isFullySelected
                                  ? "bg-orange-500/20"
                                  : "bg-primary/5"
                              }`}
                              style={{ width: `${volumeRatio}%` }}
                            />
                            {!isFullySelected && selectedVolumeRatio > 0 && (
                              <div
                                className="absolute inset-y-0 left-0 h-full bg-orange-500/20"
                                style={{ width: `${selectedVolumeRatio}%` }}
                              />
                            )}
                          </div>
                          <div className="relative">
                            <div className="mt-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Price
                                </p>
                                <p className="text-xl font-semibold text-green-600">
                                  {group.priceLabel}
                                </p>
                                {showUsdTag && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatUsd(groupUsd)}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Volume
                                </p>
                                <p className="text-xl font-semibold">
                                  {group.volume.toLocaleString()} mCKB
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {groupTokens.map((token) => (
                                <Badge
                                  key={`${group.priceLabel}-${token}`}
                                  variant="secondary"
                                >
                                  {token}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Mining Recruiting Details</DialogTitle>
                          <DialogDescription>
                            {group.items.length} recruitings at this price
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                          {group.items.map((recruiting) => {
                            const recruitingUsd = priceToUsd(recruiting.price);
                            return (
                              <div
                                key={`recruit-detail-${recruiting.id}`}
                                className="rounded-lg border border-border p-3 space-y-2"
                              >
                                {shouldShowUsd(recruiting.tokens) && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Price (USD)
                                    </span>
                                    <span className="font-medium">
                                      {formatUsd(recruitingUsd)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Price (CKB)
                                  </span>
                                  <span className="font-medium">
                                    {formatCkb(recruiting.price)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Price Mode
                                  </span>
                                  <span className="font-medium">
                                    {recruiting.priceMode}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Volume
                                  </span>
                                  <span className="font-medium">
                                    {recruiting.volume} mCKB
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Volume Mode
                                  </span>
                                  <span className="font-medium">
                                    {recruiting.volumeMode}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Accepts
                                  </span>
                                  <span className="font-medium">
                                    {recruiting.tokens.join(", ")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Collateral Ratio
                                  </span>
                                  <span className="font-medium">
                                    {recruiting.icr}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <p className="text-xs text-muted-foreground">
                            Partial fills supported. Any remaining amount can be
                            filled across other recruitings.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={recruitingsPage === 1}
                    onClick={() => setRecruitingsPage((page) => page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {recruitingsPage} of {recruitingPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={recruitingsPage === recruitingPages}
                    onClick={() => setRecruitingsPage((page) => page + 1)}
                  >
                    Next
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Accept Selected Recruitings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Recruitings Acceptance</DialogTitle>
                      <DialogDescription>
                        Review the selected recruitings and confirm your total
                        mint amount.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected</span>
                        <span className="font-medium">
                          {selectedRecruitings.length} recruitings
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Average Price
                        </span>
                        <span className="font-medium">
                          {selectedRecruitingAvgPrice.toFixed(2)} CKB
                        </span>
                      </div>
                      {selectedRecruitingsNeedUsd && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Average Price (USD)
                          </span>
                          <span className="font-medium">
                            {formatUsd(selectedRecruitingAvgUsd)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Volume
                        </span>
                        <span className="font-medium">
                          {selectedRecruitingVolume.toLocaleString()} mCKB
                        </span>
                      </div>
                      <div className="rounded-lg border border-border p-3 space-y-3">
                        {selectedRecruitings.map((recruiting) => {
                          const showUsd = shouldShowUsd(recruiting.tokens);
                          return (
                            <div
                              key={`confirm-recruit-${recruiting.id}`}
                              className="flex items-start justify-between"
                            >
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {recruiting.sponsor}
                                </p>
                                <p className="text-sm font-medium">
                                  {formatCkb(recruiting.price)}
                                </p>
                                {showUsd && (
                                  <p className="text-xs text-muted-foreground">
                                    {formatUsd(priceToUsd(recruiting.price))}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Volume
                                </p>
                                <p className="text-sm font-medium">
                                  {recruiting.volume} mCKB
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Partial fills are allowed. Any remaining amount can be
                        filled across other recruitings.
                      </p>
                    </div>
                    <Button className="w-full">Confirm Acceptance</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Positions</CardTitle>
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
                    <span className="text-muted-foreground">Individual ICR</span>
                    <span className="font-medium text-green-600">185%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recovery Mode Status
                    </span>
                    <span className="font-medium text-green-600">Healthy</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Health Status</span>
                  </div>
                  <Progress value={85} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Safe - Well above recovery threshold (CCR)
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

            <Card>
              <CardHeader>
                <CardTitle>My Fundings</CardTitle>
                <CardDescription>Active sponsorship commitments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Funding (CKB)
                    </span>
                    <span className="font-medium">4,200 CKB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Funding (RUSD)
                    </span>
                    <span className="font-medium">1,500 RUSD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Funding (USDT)
                    </span>
                    <span className="font-medium">2,750 USDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Funding (USDC)
                    </span>
                    <span className="font-medium">900 USDC</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Remaining Volume to Fill
                    </span>
                    <span className="font-medium">18,500 mCKB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>My Offerings</CardTitle>
                  <CardDescription>
                    Active schedules you published
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">New Offering</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Mining Offering</DialogTitle>
                      <DialogDescription>
                        Define price, volume, and repayment expectations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" step="0.01" placeholder="0.95" />
                      </div>
                      <div className="space-y-2">
                        <Label>Price Mode</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ckb-absolute">
                              CKB absolute price
                            </SelectItem>
                            <SelectItem value="stable-absolute">
                              Stable coin, absolute price
                            </SelectItem>
                            <SelectItem value="stable-offset">
                              Stable coin, percentage offset
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Volume</Label>
                        <Input type="number" step="1" placeholder="50000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Volume Mode</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select volume mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="absolute">
                              Absolute volume
                            </SelectItem>
                            <SelectItem value="target-icr">
                              Target ICR
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Expected Day of Repay</Label>
                        <RepayOptions />
                      </div>
                    </div>
                    <Button className="w-full">Publish Offering</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {offerings.slice(0, 3).map((offer) => (
                <div
                  key={`mine-offer-${offer.id}`}
                  className="rounded-lg border border-border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {formatCkb(offer.price)}
                      </p>
                      {shouldShowUsd(offer.tokens) && (
                        <p className="text-xs text-muted-foreground">
                          {formatUsd(priceToUsd(offer.price))}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {offer.volume} mCKB total
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Filled</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2 mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modify Offering</DialogTitle>
                          <DialogDescription>
                            Update price, volume, and repayment expectations.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.95"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Price Mode</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select price mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ckb-absolute">
                                  CKB absolute price
                                </SelectItem>
                                <SelectItem value="stable-absolute">
                                  Stable coin, absolute price
                                </SelectItem>
                                <SelectItem value="stable-offset">
                                  Stable coin, percentage offset
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Volume</Label>
                            <Input type="number" step="1" placeholder="50000" />
                          </div>
                          <div className="space-y-2">
                            <Label>Volume Mode</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select volume mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="absolute">
                                  Absolute volume
                                </SelectItem>
                                <SelectItem value="target-icr">
                                  Target ICR
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Expected Day of Repay</Label>
                            <RepayOptions />
                          </div>
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Pause
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>My Recruitings</CardTitle>
                  <CardDescription>Schedules you sponsor</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">New Recruiting</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Mining Recruiting</DialogTitle>
                      <DialogDescription>
                        Define price, volume, and repayment expectations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" step="0.01" placeholder="0.95" />
                      </div>
                      <div className="space-y-2">
                        <Label>Price Mode</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ckb-absolute">
                              CKB absolute price
                            </SelectItem>
                            <SelectItem value="stable-absolute">
                              Stable coin, absolute price
                            </SelectItem>
                            <SelectItem value="stable-offset">
                              Stable coin, percentage offset
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Volume</Label>
                        <Input type="number" step="1" placeholder="50000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Volume Mode</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select volume mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="absolute">
                              Absolute volume
                            </SelectItem>
                            <SelectItem value="target-icr">
                              Target ICR
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full">Publish Recruiting</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recruitings.slice(0, 3).map((recruiting) => (
                <div
                  key={`mine-recruit-${recruiting.id}`}
                  className="rounded-lg border border-border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {formatCkb(recruiting.price)}
                      </p>
                      {shouldShowUsd(recruiting.tokens) && (
                        <p className="text-xs text-muted-foreground">
                          {formatUsd(priceToUsd(recruiting.price))}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {recruiting.volume} mCKB total
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Filled</span>
                      <span>47%</span>
                    </div>
                    <Progress value={47} className="h-2 mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modify Recruiting</DialogTitle>
                          <DialogDescription>
                            Update price, volume, and repayment expectations.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.95"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Price Mode</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select price mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ckb-absolute">
                                  CKB absolute price
                                </SelectItem>
                                <SelectItem value="stable-absolute">
                                  Stable coin, absolute price
                                </SelectItem>
                                <SelectItem value="stable-offset">
                                  Stable coin, percentage offset
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Volume</Label>
                            <Input type="number" step="1" placeholder="50000" />
                          </div>
                          <div className="space-y-2">
                            <Label>Volume Mode</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select volume mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="absolute">
                                  Absolute volume
                                </SelectItem>
                                <SelectItem value="target-icr">
                                  Target ICR
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Expected Day of Repay</Label>
                            <RepayOptions />
                          </div>
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Pause
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
