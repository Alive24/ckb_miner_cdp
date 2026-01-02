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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUp,
  ArrowDown,
  History,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

// Protocol state type definition
interface ProtocolState {
  individual: {
    collateral: number;
    debt: number;
    ratio: number | null;
  };
  total: {
    collateral: number;
    debt: number;
    ratio: number | null;
  };
  treasury: {
    mckb: number;
    ckb: number;
    debt: number;
  };
  supply: {
    mckb: number;
  };
  solvency: {
    ckb: number;
  };
}

// Action history record
interface ActionHistory {
  id: number;
  action: string;
  state: ProtocolState;
  notes: string;
  params?: Record<string, string>;
  actorId?: string;
  actorName?: string;
}

// Actor definition
interface Actor {
  id: string;
  name: string;
  state: ProtocolState;
  history: ActionHistory[];
}

// Initial state
const initialState: ProtocolState = {
  individual: {
    collateral: 0,
    debt: 0,
    ratio: null,
  },
  total: {
    collateral: 200,
    debt: 100,
    ratio: 200.0,
  },
  treasury: {
    mckb: 0,
    ckb: 0,
    debt: 0,
  },
  supply: {
    mckb: 100, // Equals total debt
  },
  solvency: {
    ckb: 200, // Total Collateral + Treasury mCKB + Treasury CKB - Total Debt
  },
};

// LCR (Liquidation Collateral Ratio) - 150%
const LCR = 150;

export default function SimulatorPage() {
  const [actors, setActors] = useState<Actor[]>([
    {
      id: "actor-1",
      name: "Main Actor",
      state: { ...initialState },
      history: [
        {
          id: 0,
          action: "Initial State",
          state: { ...initialState },
          notes: "Assume 5 other miners",
        },
      ],
    },
  ]);
  const [currentActorId, setCurrentActorId] = useState<string>("actor-1");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [actionParams, setActionParams] = useState<Record<string, string>>({});
  const [newActorName, setNewActorName] = useState<string>("");
  const [editingInitialState, setEditingInitialState] = useState(false);
  const [initialStateEdit, setInitialStateEdit] = useState<ProtocolState>({
    ...initialState,
  });
  // Global history containing all actors' actions
  const [globalHistory, setGlobalHistory] = useState<ActionHistory[]>([
    {
      id: 0,
      action: "Initial State",
      state: { ...initialState },
      notes: "Assume 5 other miners",
      actorId: "actor-1",
      actorName: "Main Actor",
    },
  ]);

  const mainActor = useMemo(() => actors[0], [actors]);
  const currentActor = useMemo(
    () => actors.find((a) => a.id === currentActorId) || actors[0],
    [actors, currentActorId]
  );

  // Calculate total state from all actors
  const calculateTotalState = useMemo(() => {
    const total: ProtocolState = {
      individual: { collateral: 0, debt: 0, ratio: null },
      total: { collateral: 0, debt: 0, ratio: null },
      treasury: { mckb: 0, ckb: 0, debt: 0 },
      supply: { mckb: 0 },
      solvency: { ckb: 0 },
    };

    actors.forEach((actor) => {
      total.total.collateral += actor.state.individual.collateral;
      total.total.debt += actor.state.individual.debt;
    });

    // Use shared state from first actor (they should all be the same)
    if (actors.length > 0) {
      total.treasury.mckb = actors[0].state.treasury.mckb;
      total.treasury.ckb = actors[0].state.treasury.ckb;
      total.treasury.debt = actors[0].state.treasury.debt;
    }

    // Total includes Treasury: Total Collateral includes Treasury CKB, Total Debt includes Treasury Debt
    total.total.collateral += total.treasury.ckb;
    total.total.debt += total.treasury.debt;

    // Supply mCKB equals total Debt
    total.supply.mckb = total.total.debt;

    // Solvency Surplus = Total Collateral + Treasury mCKB + Treasury CKB - Total Debt
    total.solvency.ckb =
      total.total.collateral +
      total.treasury.mckb +
      total.treasury.ckb -
      total.total.debt;

    total.total.ratio =
      total.total.debt === 0
        ? null
        : (total.total.collateral / total.total.debt) * 100;

    return total;
  }, [actors]);

  // Calculate ratio
  const calculateRatio = (collateral: number, debt: number): number | null => {
    if (debt === 0) return null;
    return (collateral / debt) * 100;
  };

  // Format number display
  const formatNumber = (value: number | null): string => {
    if (value === null) return "N/A";
    return value.toFixed(0);
  };

  // Format ratio display
  const formatRatio = (ratio: number | null): string => {
    if (ratio === null) return "N/A";
    if (ratio > 999.9) return "++";
    return ratio.toFixed(1) + "%";
  };

  // Get change display
  const getChangeDisplay = (
    oldValue: number | null,
    newValue: number | null
  ): { display: string; isIncrease: boolean } => {
    if (oldValue === null && newValue === null)
      return { display: "", isIncrease: false };
    if (oldValue === null) {
      return { display: `+${formatNumber(newValue)}`, isIncrease: true };
    }
    if (newValue === null) {
      return { display: `-${formatNumber(oldValue)}`, isIncrease: false };
    }
    const diff = newValue - oldValue;
    if (diff === 0) return { display: "", isIncrease: false };
    const sign = diff > 0 ? "+" : "";
    return { display: `${sign}${diff.toFixed(0)}`, isIncrease: diff > 0 };
  };

  // Get ratio change display
  const getRatioChangeDisplay = (
    oldRatio: number | null,
    newRatio: number | null
  ): { display: string; isIncrease: boolean; change: number | null } => {
    if (oldRatio === null && newRatio === null)
      return { display: "", isIncrease: false, change: null };
    if (oldRatio === null) {
      return {
        display: `+${formatRatio(newRatio)}`,
        isIncrease: true,
        change: newRatio,
      };
    }
    if (newRatio === null) {
      return {
        display: `-${formatRatio(oldRatio)}`,
        isIncrease: false,
        change: -oldRatio,
      };
    }
    const diff = newRatio - oldRatio;
    if (diff === 0)
      return { display: formatRatio(newRatio), isIncrease: false, change: 0 };
    const sign = diff > 0 ? "+" : "";
    return {
      display: `${formatRatio(newRatio)} (${sign}${diff.toFixed(1)}%)`,
      isIncrease: diff > 0,
      change: diff,
    };
  };

  // Execute action
  const executeAction = (action: string, params: Record<string, string>) => {
    const actor = actors.find((a) => a.id === currentActorId);
    if (!actor) return;

    const oldState = JSON.parse(JSON.stringify(actor.state));
    let newState: ProtocolState = JSON.parse(JSON.stringify(actor.state));
    let notes = "";

    switch (action) {
      case "stake":
        const stakeAmount = parseFloat(params.amount || "0");
        const liquidationReserve = stakeAmount * 0.005;
        const debtFromStake = liquidationReserve;

        newState.individual.collateral += stakeAmount;
        newState.individual.debt += debtFromStake;
        newState.individual.ratio = calculateRatio(
          newState.individual.collateral,
          newState.individual.debt
        );

        // Update total, treasury, supply, solvency (shared across all actors)
        newState.total.collateral += stakeAmount;
        newState.total.debt += debtFromStake;
        // Supply mCKB equals total Debt (automatically updated)
        // Solvency Surplus will be recalculated based on formula

        notes = `${liquidationReserve.toFixed(0)} Liquidation Reserve`;
        break;

      case "mining_offering":
        const offeringAmountCkb = parseFloat(params.amount || "0");
        const offeringPrice = parseFloat(params.price || "0.95");
        const offeringDebt = offeringAmountCkb;
        const offeringFee = offeringDebt * 0.01;

        newState.individual.debt += offeringDebt;
        newState.individual.ratio = calculateRatio(
          newState.individual.collateral,
          newState.individual.debt
        );

        // Update total, treasury, supply (shared across all actors)
        newState.total.debt += offeringDebt;
        newState.treasury.mckb += offeringFee;
        // Supply mCKB equals total Debt (automatically updated)

        notes = `${offeringFee.toFixed(0)} Fee. Mining provider gets 1`;
        break;

      case "repay":
        const repayAmount = parseFloat(params.amount || "0");

        newState.individual.debt -= repayAmount;
        newState.individual.ratio = calculateRatio(
          newState.individual.collateral,
          newState.individual.debt
        );

        // Update total, treasury (shared across all actors)
        newState.total.debt -= repayAmount;
        newState.treasury.ckb += repayAmount;
        newState.treasury.debt += repayAmount;
        // Supply mCKB equals total Debt (automatically updated)
        // Solvency Surplus will be recalculated based on formula
        break;

      case "redeem":
        const redeemAmount = parseFloat(params.amount || "0");
        const redeemFee = redeemAmount * 0.01;

        newState.individual.collateral -= redeemAmount;
        newState.individual.debt -= redeemAmount;
        newState.individual.ratio = calculateRatio(
          newState.individual.collateral,
          newState.individual.debt
        );

        // Update total, treasury, supply (shared across all actors)
        newState.total.collateral -= redeemAmount;
        newState.total.debt -= redeemAmount;
        newState.treasury.ckb += redeemFee;
        // Supply mCKB equals total Debt (automatically updated)
        // Solvency Surplus will be recalculated based on formula

        notes = "14 days waiting time at 1% fee";
        break;

      case "withdraw":
        const withdrawAmount = parseFloat(params.amount || "0");

        newState.individual.collateral -= withdrawAmount;
        newState.individual.ratio = calculateRatio(
          newState.individual.collateral,
          newState.individual.debt
        );

        // Update total, solvency (shared across all actors)
        newState.total.collateral -= withdrawAmount;
        // Solvency Surplus will be recalculated based on formula
        break;

      case "interest":
        const interestAmount = parseFloat(params.amount || "0");

        newState.individual.debt += interestAmount;
        newState.individual.ratio = calculateRatio(
          newState.individual.collateral,
          newState.individual.debt
        );

        // Update total, treasury, supply (shared across all actors)
        newState.total.debt += interestAmount;
        newState.treasury.mckb += interestAmount;
        // Supply mCKB equals total Debt (automatically updated)
        notes = "";

        // Check if liquidation should occur (ICR < LCR)
        if (
          newState.individual.ratio !== null &&
          newState.individual.ratio < LCR &&
          newState.individual.collateral > 0
        ) {
          // Auto liquidation
          newState.individual.collateral = 0;
          const liquidatedDebt = newState.individual.debt;
          newState.individual.debt = 0;
          newState.individual.ratio = null;

          // Update total, treasury (shared across all actors)
          newState.total.collateral -= oldState.individual.collateral;
          newState.total.debt -= liquidatedDebt;

          const liquidationCollateral = oldState.individual.collateral;
          const liquidationReserveAmount = oldState.individual.debt * 0.05;

          newState.treasury.ckb +=
            liquidationCollateral + liquidationReserveAmount;
          newState.treasury.debt += liquidatedDebt;
          // Supply mCKB equals total Debt (automatically updated)
          // Solvency Surplus will be recalculated based on formula

          notes += " (Auto liquidation triggered: ICR < LCR)";
        }
        break;

      default:
        return;
    }

    // Get current actor for name
    const currentActor = actors.find((a) => a.id === currentActorId);
    const actionHistoryRecord: ActionHistory = {
      id: globalHistory.length,
      action: getActionLabel(action),
      state: JSON.parse(JSON.stringify(newState)), // Deep copy
      notes,
      params: { ...params },
      actorId: currentActorId,
      actorName: currentActor?.name || "Unknown",
    };

    // Update actor state and history
    // Also sync total, treasury, supply, solvency to all actors
    setActors((prevActors) => {
      return prevActors.map((a) => {
        if (a.id === currentActorId) {
          const newHistory = [
            ...a.history,
            {
              ...actionHistoryRecord,
              id: a.history.length,
            },
          ];
          return {
            ...a,
            state: JSON.parse(JSON.stringify(newState)), // Deep copy
            history: newHistory,
          };
        } else {
          // Sync shared state (total, treasury, supply, solvency) to other actors
          return {
            ...a,
            state: {
              ...a.state,
              total: { ...newState.total },
              treasury: { ...newState.treasury },
              supply: { ...newState.supply },
              solvency: { ...newState.solvency },
            },
          };
        }
      });
    });

    // Add to global history
    setGlobalHistory((prev) => [...prev, actionHistoryRecord]);

    setActionParams({});
    setSelectedAction("");
  };

  // Get action label
  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      stake: "Stakes",
      mining_offering: "Mining Offering / Recruiting",
      repay: "Repays",
      redeem: "Redeems",
      withdraw: "Withdraws",
      interest: "Interests + Late Repay Penalty",
      liquidation: "Liquidation",
    };
    return labels[action] || action;
  };

  // Reset to initial state
  const resetToInitial = () => {
    const initialStateRecord: ActionHistory = {
      id: 0,
      action: "Initial State",
      state: JSON.parse(JSON.stringify(initialStateEdit)),
      notes: "Assume 5 other miners",
      actorId: "actor-1",
      actorName: "Main Actor",
    };

    setActors((prevActors) => {
      return prevActors.map((a) => {
        return {
          ...a,
          state: JSON.parse(JSON.stringify(initialStateEdit)),
          history: [
            {
              ...initialStateRecord,
              id: 0,
            },
          ],
        };
      });
    });
    setGlobalHistory([initialStateRecord]);
    setActionParams({});
    setSelectedAction("");
  };

  // Restore to a specific history state
  const restoreToHistoryState = (historyIndex: number) => {
    if (historyIndex < 0 || historyIndex >= globalHistory.length) return;

    const targetRecord = globalHistory[historyIndex];
    const targetState = targetRecord.state;

    // Update all actors to the target state
    setActors((prevActors) => {
      return prevActors.map((a) => {
        // Find this actor's state at the target point in history
        let actorStateAtPoint: ProtocolState = {
          individual: { collateral: 0, debt: 0, ratio: null },
          total: targetState.total,
          treasury: targetState.treasury,
          supply: { mckb: 0 },
          solvency: { ckb: 0 },
        };
        let actorHistoryAtPoint: ActionHistory[] = [];

        // Build actor history up to the target point
        for (let i = 0; i <= historyIndex; i++) {
          const record = globalHistory[i];
          if (record.actorId === a.id) {
            actorHistoryAtPoint.push(record);
            actorStateAtPoint = record.state;
          } else {
            // Update shared state for non-actor records
            actorStateAtPoint = {
              individual: actorStateAtPoint.individual, // Keep individual state
              total: record.state.total,
              treasury: record.state.treasury,
              supply: record.state.supply,
              solvency: record.state.solvency,
            };
          }
        }

        // Recalculate Supply and Solvency Surplus based on formulas
        // Supply mCKB = Total Debt
        actorStateAtPoint.supply.mckb = actorStateAtPoint.total.debt;
        // Solvency Surplus = Total Collateral + Treasury mCKB + Treasury CKB - Total Debt
        actorStateAtPoint.solvency.ckb =
          actorStateAtPoint.total.collateral +
          actorStateAtPoint.treasury.mckb +
          actorStateAtPoint.treasury.ckb -
          actorStateAtPoint.total.debt;

        // If no history found, use initial state
        if (actorHistoryAtPoint.length === 0) {
          actorHistoryAtPoint = [
            {
              id: 0,
              action: "Initial State",
              state: { ...initialStateEdit },
              notes: "Assume 5 other miners",
              actorId: a.id,
              actorName: a.name,
            },
          ];
          actorStateAtPoint = {
            individual:
              a.id === mainActor.id
                ? initialStateEdit.individual
                : { collateral: 0, debt: 0, ratio: null },
            total: targetState.total,
            treasury: targetState.treasury,
            supply: { mckb: targetState.total.debt },
            solvency: {
              ckb:
                targetState.total.collateral +
                targetState.treasury.mckb +
                targetState.treasury.ckb -
                targetState.total.debt,
            },
          };
        }

        return {
          ...a,
          state: actorStateAtPoint,
          history: actorHistoryAtPoint,
        };
      });
    });

    // Truncate global history
    setGlobalHistory((prev) => prev.slice(0, historyIndex + 1));
  };

  // Update initial state
  const updateInitialState = () => {
    // Recalculate Supply and Solvency Surplus based on formulas
    const updatedState = JSON.parse(JSON.stringify(initialStateEdit));
    // Supply mCKB = Total Debt
    updatedState.supply.mckb = updatedState.total.debt;
    // Solvency Surplus = Total Collateral + Treasury mCKB + Treasury CKB - Total Debt
    updatedState.solvency.ckb =
      updatedState.total.collateral +
      updatedState.treasury.mckb +
      updatedState.treasury.ckb -
      updatedState.total.debt;

    const initialStateRecord: ActionHistory = {
      id: 0,
      action: "Initial State",
      state: updatedState,
      notes: "Assume 5 other miners",
      actorId: "actor-1",
      actorName: "Main Actor",
    };

    setActors((prevActors) => {
      return prevActors.map((a) => {
        return {
          ...a,
          state: JSON.parse(JSON.stringify(updatedState)),
          history: [
            {
              ...initialStateRecord,
              id: 0,
              actorId: a.id,
              actorName: a.name,
            },
          ],
        };
      });
    });
    setGlobalHistory([initialStateRecord]);
    setEditingInitialState(false);
  };

  // Create new actor
  const createActor = () => {
    const newId = `actor-${Date.now()}`;
    const actorName = newActorName || `Actor ${actors.length + 1}`;
    // Get current shared state from first actor
    const currentSharedState = actors[0].state;
    const newActor: Actor = {
      id: newId,
      name: actorName,
      state: {
        individual: { collateral: 0, debt: 0, ratio: null },
        total: { ...currentSharedState.total },
        treasury: { ...currentSharedState.treasury },
        supply: { ...currentSharedState.supply },
        solvency: { ...currentSharedState.solvency },
      },
      history: [
        {
          id: 0,
          action: "Initial State",
          state: {
            individual: { collateral: 0, debt: 0, ratio: null },
            total: { ...currentSharedState.total },
            treasury: { ...currentSharedState.treasury },
            supply: { ...currentSharedState.supply },
            solvency: { ...currentSharedState.solvency },
          },
          notes: "",
          actorId: newId,
          actorName,
        },
      ],
    };
    setActors([...actors, newActor]);
    setCurrentActorId(newId);
    setNewActorName("");
  };

  // Delete actor
  const deleteActor = (actorId: string) => {
    if (actors.length === 1) return; // Don't delete the last actor
    const updatedActors = actors.filter((a) => a.id !== actorId);
    setActors(updatedActors);
    if (currentActorId === actorId) {
      setCurrentActorId(updatedActors[0].id);
    }
  };

  // Render action form
  const renderActionForm = () => {
    if (!selectedAction) return null;

    const renderInput = (label: string, key: string, placeholder: string) => (
      <div className="space-y-1">
        <Label className="text-xs">{label}</Label>
        <Input
          type="number"
          step="0.01"
          placeholder={placeholder}
          className="h-9"
          value={actionParams[key] || ""}
          onChange={(e) =>
            setActionParams({ ...actionParams, [key]: e.target.value })
          }
        />
      </div>
    );

    return (
      <div className="flex items-end gap-2">
        {selectedAction === "stake" &&
          renderInput("Stake Amount (CKB)", "amount", "2000")}
        {selectedAction === "mining_offering" && (
          <>
            {renderInput("Amount (CKB)", "amount", "1000")}
            {renderInput("Price", "price", "0.95")}
          </>
        )}
        {selectedAction === "repay" &&
          renderInput("Repay Amount (CKB)", "amount", "500")}
        {selectedAction === "redeem" &&
          renderInput("Redeem Amount (mCKB)", "amount", "200")}
        {selectedAction === "withdraw" &&
          renderInput("Withdraw Amount (CKB)", "amount", "1200")}
        {selectedAction === "interest" &&
          renderInput("Interest/Penalty (CKB)", "amount", "80")}
        <Button
          onClick={() => {
            if (
              Object.keys(actionParams).length > 0 ||
              selectedAction === "interest"
            ) {
              executeAction(selectedAction, actionParams);
            }
          }}
          disabled={
            (selectedAction === "stake" ||
              selectedAction === "repay" ||
              selectedAction === "redeem" ||
              selectedAction === "withdraw" ||
              selectedAction === "mining_offering") &&
            !actionParams.amount
          }
        >
          Execute
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedAction("");
            setActionParams({});
          }}
        >
          Cancel
        </Button>
      </div>
    );
  };

  // Get previous state for comparison
  const getPreviousState = (): ProtocolState | null => {
    if (currentActor.history.length < 2) return null;
    return currentActor.history[currentActor.history.length - 2].state;
  };

  const prevState = getPreviousState();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Protocol Simulator</h2>
          <p className="text-muted-foreground">
            Simulate the impact of different actions on protocol metrics
          </p>
        </div>

        {/* Current state table with improved layout */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Individual & Protocol State</CardTitle>
              </div>
              <Dialog
                open={editingInitialState}
                onOpenChange={setEditingInitialState}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Edit Initial State
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Initial State</DialogTitle>
                    <DialogDescription>
                      Edit the initial state values
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Individual Collateral (CKB)</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.individual.collateral}
                        onChange={(e) =>
                          setInitialStateEdit({
                            ...initialStateEdit,
                            individual: {
                              ...initialStateEdit.individual,
                              collateral: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Individual Debt</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.individual.debt}
                        onChange={(e) => {
                          const debt = parseFloat(e.target.value) || 0;
                          setInitialStateEdit({
                            ...initialStateEdit,
                            individual: {
                              ...initialStateEdit.individual,
                              debt,
                              ratio: calculateRatio(
                                initialStateEdit.individual.collateral,
                                debt
                              ),
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Collateral (CKB)</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.total.collateral}
                        onChange={(e) => {
                          const collateral = parseFloat(e.target.value) || 0;
                          setInitialStateEdit({
                            ...initialStateEdit,
                            total: {
                              ...initialStateEdit.total,
                              collateral,
                              ratio: calculateRatio(
                                collateral,
                                initialStateEdit.total.debt
                              ),
                            },
                            // Recalculate solvency surplus
                            solvency: {
                              ckb:
                                collateral +
                                initialStateEdit.treasury.mckb +
                                initialStateEdit.treasury.ckb -
                                initialStateEdit.total.debt,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Debt</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.total.debt}
                        onChange={(e) => {
                          const debt = parseFloat(e.target.value) || 0;
                          setInitialStateEdit({
                            ...initialStateEdit,
                            total: {
                              ...initialStateEdit.total,
                              debt,
                              ratio: calculateRatio(
                                initialStateEdit.total.collateral,
                                debt
                              ),
                            },
                            // Recalculate supply and solvency surplus
                            supply: {
                              mckb: debt, // Supply equals Total Debt
                            },
                            solvency: {
                              ckb:
                                initialStateEdit.total.collateral +
                                initialStateEdit.treasury.mckb +
                                initialStateEdit.treasury.ckb -
                                debt,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Treasury mCKB</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.treasury.mckb}
                        onChange={(e) => {
                          const mckb = parseFloat(e.target.value) || 0;
                          setInitialStateEdit({
                            ...initialStateEdit,
                            treasury: {
                              ...initialStateEdit.treasury,
                              mckb,
                            },
                            // Recalculate solvency surplus
                            solvency: {
                              ckb:
                                initialStateEdit.total.collateral +
                                mckb +
                                initialStateEdit.treasury.ckb -
                                initialStateEdit.total.debt,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Treasury CKB</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.treasury.ckb}
                        onChange={(e) => {
                          const ckb = parseFloat(e.target.value) || 0;
                          setInitialStateEdit({
                            ...initialStateEdit,
                            treasury: {
                              ...initialStateEdit.treasury,
                              ckb,
                            },
                            // Recalculate solvency surplus
                            solvency: {
                              ckb:
                                initialStateEdit.total.collateral +
                                initialStateEdit.treasury.mckb +
                                ckb -
                                initialStateEdit.total.debt,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Treasury Debt</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.treasury.debt}
                        onChange={(e) => {
                          const debt = parseFloat(e.target.value) || 0;
                          setInitialStateEdit({
                            ...initialStateEdit,
                            treasury: {
                              ...initialStateEdit.treasury,
                              debt,
                            },
                            // Recalculate solvency surplus
                            solvency: {
                              ckb:
                                initialStateEdit.total.collateral +
                                initialStateEdit.treasury.mckb +
                                initialStateEdit.treasury.ckb -
                                initialStateEdit.total.debt,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supply mCKB (Calculated)</Label>
                      <Input
                        type="number"
                        value={initialStateEdit.total.debt}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Equals Total Debt
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Solvency Surplus (Calculated)</Label>
                      <Input
                        type="number"
                        value={
                          initialStateEdit.total.collateral +
                          initialStateEdit.treasury.mckb +
                          initialStateEdit.treasury.ckb -
                          initialStateEdit.total.debt
                        }
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Total Collateral + Treasury mCKB + Treasury CKB - Total
                        Debt
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Generate random initial state
                        const randomIndividualCollateral =
                          Math.floor(Math.random() * 5000) + 1000;
                        const randomIndividualDebt =
                          Math.floor(Math.random() * 2000) + 500;
                        const randomTotalCollateral =
                          randomIndividualCollateral +
                          Math.floor(Math.random() * 10000) +
                          5000;
                        const randomTotalDebt =
                          randomIndividualDebt +
                          Math.floor(Math.random() * 5000) +
                          2000;
                        const randomTreasuryCKB =
                          Math.floor(Math.random() * 3000) + 500;
                        const randomTreasuryDebt =
                          Math.floor(Math.random() * 2000) + 500;
                        const randomTreasuryMCKB = Math.floor(
                          Math.random() * 1000
                        );

                        const newState: ProtocolState = {
                          individual: {
                            collateral: randomIndividualCollateral,
                            debt: randomIndividualDebt,
                            ratio: calculateRatio(
                              randomIndividualCollateral,
                              randomIndividualDebt
                            ),
                          },
                          total: {
                            collateral: randomTotalCollateral,
                            debt: randomTotalDebt,
                            ratio: calculateRatio(
                              randomTotalCollateral,
                              randomTotalDebt
                            ),
                          },
                          treasury: {
                            mckb: randomTreasuryMCKB,
                            ckb: randomTreasuryCKB,
                            debt: randomTreasuryDebt,
                          },
                          supply: {
                            mckb: randomTotalDebt, // Supply equals Total Debt
                          },
                          solvency: {
                            ckb:
                              randomTotalCollateral +
                              randomTreasuryMCKB +
                              randomTreasuryCKB -
                              randomTotalDebt,
                          },
                        };

                        setInitialStateEdit(newState);
                      }}
                    >
                      Random State
                    </Button>
                    <Button onClick={updateInitialState} className="flex-1">
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setInitialStateEdit({ ...initialState });
                        setEditingInitialState(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="align-middle">
                      Action
                    </TableHead>
                    <TableHead colSpan={3} className="text-center">
                      Individual ({mainActor.name})
                    </TableHead>
                    <TableHead colSpan={3} className="text-center">
                      Total
                    </TableHead>
                    <TableHead colSpan={3} className="text-center">
                      Treasury
                    </TableHead>
                    <TableHead rowSpan={2} className="align-middle">
                      Supply <br /> (mCKB)
                    </TableHead>
                    <TableHead rowSpan={2} className="align-middle">
                      Solvency <br /> Surplus
                    </TableHead>
                    <TableHead rowSpan={2} className="align-middle">
                      Notes
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead>Collateral</TableHead>
                    <TableHead>Debt</TableHead>
                    <TableHead>Ratio</TableHead>
                    <TableHead>Collateral</TableHead>
                    <TableHead>Debt</TableHead>
                    <TableHead>Ratio</TableHead>
                    <TableHead>mCKB</TableHead>
                    <TableHead>CKB</TableHead>
                    <TableHead>Debt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalHistory.map((record, index) => {
                    const isCurrent = index === globalHistory.length - 1;
                    const prevRecord =
                      index > 0 ? globalHistory[index - 1] : null;

                    // Find main actor's individual state at this point
                    let mainActorIndividualState = record.state.individual;
                    if (record.actorId !== mainActor.id) {
                      // Find the last record from main actor before or at this index
                      for (let i = index; i >= 0; i--) {
                        if (globalHistory[i].actorId === mainActor.id) {
                          mainActorIndividualState =
                            globalHistory[i].state.individual;
                          break;
                        }
                      }
                      // If no main actor record found, use initial state
                      if (index === 0 && record.actorId !== mainActor.id) {
                        mainActorIndividualState = {
                          collateral: 0,
                          debt: 0,
                          ratio: null,
                        };
                      }
                    }

                    // Calculate total from all actors at this point
                    const totalState = isCurrent
                      ? calculateTotalState
                      : {
                          total: record.state.total,
                          treasury: record.state.treasury,
                          supply: record.state.supply,
                          solvency: record.state.solvency,
                        };

                    // Get action type for parameter display
                    const actionType = record.action.toLowerCase();

                    // Find previous main actor individual state for comparison
                    let prevMainActorIndividualState = mainActorIndividualState;
                    if (prevRecord) {
                      for (let i = index - 1; i >= 0; i--) {
                        if (globalHistory[i].actorId === mainActor.id) {
                          prevMainActorIndividualState =
                            globalHistory[i].state.individual;
                          break;
                        }
                      }
                    }

                    return (
                      <TableRow
                        key={record.id}
                        className={isCurrent ? "bg-muted/50" : ""}
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center flex-wrap gap-1">
                                <span>{record.action}</span>
                                {record.actorId &&
                                  record.actorId !== mainActor.id && (
                                    <Badge className="ml-1" variant="secondary">
                                      {record.actorName}
                                    </Badge>
                                  )}
                                {isCurrent && (
                                  <Badge className="ml-1" variant="outline">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs flex-shrink-0"
                                onClick={() => restoreToHistoryState(index)}
                                disabled={isCurrent}
                              >
                                Restore
                              </Button>
                            </div>
                            {record.params &&
                              Object.keys(record.params).length > 0 && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  {Object.entries(record.params)
                                    .map(([key, value]) => {
                                      if (!value || value === "0") return null;
                                      // Determine label based on action type and key
                                      let label = key;
                                      if (key === "amount") {
                                        if (
                                          actionType.includes("stake") ||
                                          actionType.includes("repay") ||
                                          actionType.includes("withdraw")
                                        ) {
                                          label = "Amount (CKB)";
                                        } else if (
                                          actionType.includes("redeem")
                                        ) {
                                          label = "Amount (mCKB)";
                                        } else if (
                                          actionType.includes("offering") ||
                                          actionType.includes("recruiting")
                                        ) {
                                          label = "Amount (CKB)";
                                        } else if (
                                          actionType.includes("interest")
                                        ) {
                                          label = "Amount (CKB)";
                                        } else {
                                          label = "Amount";
                                        }
                                      } else if (key === "price") {
                                        label = "Price";
                                      }
                                      return `${label}: ${value}`;
                                    })
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {formatNumber(
                                mainActorIndividualState.collateral
                              )}
                            </span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevMainActorIndividualState.collateral,
                                    mainActorIndividualState.collateral
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevMainActorIndividualState.collateral,
                                        mainActorIndividualState.collateral
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevMainActorIndividualState.collateral,
                                  mainActorIndividualState.collateral
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {formatNumber(mainActorIndividualState.debt)}
                            </span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevMainActorIndividualState.debt,
                                    mainActorIndividualState.debt
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevMainActorIndividualState.debt,
                                        mainActorIndividualState.debt
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevMainActorIndividualState.debt,
                                  mainActorIndividualState.debt
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>
                              {formatRatio(mainActorIndividualState.ratio)}
                            </span>
                            {prevRecord &&
                              mainActorIndividualState.ratio !== null &&
                              prevMainActorIndividualState.ratio !== null && (
                                <>
                                  {mainActorIndividualState.ratio >
                                  prevMainActorIndividualState.ratio ? (
                                    <ArrowUp className="h-3 w-3 text-green-600" />
                                  ) : mainActorIndividualState.ratio <
                                    prevMainActorIndividualState.ratio ? (
                                    <ArrowDown className="h-3 w-3 text-red-600" />
                                  ) : null}
                                </>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {formatNumber(totalState.total.collateral)}
                            </span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.total.collateral,
                                    totalState.total.collateral
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.total.collateral,
                                        totalState.total.collateral
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.total.collateral,
                                  totalState.total.collateral
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatNumber(totalState.total.debt)}</span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.total.debt,
                                    totalState.total.debt
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.total.debt,
                                        totalState.total.debt
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.total.debt,
                                  totalState.total.debt
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{formatRatio(totalState.total.ratio)}</span>
                            {prevRecord &&
                              totalState.total.ratio !== null &&
                              prevRecord.state.total.ratio !== null && (
                                <>
                                  {totalState.total.ratio >
                                  prevRecord.state.total.ratio ? (
                                    <ArrowUp className="h-3 w-3 text-green-600" />
                                  ) : totalState.total.ratio <
                                    prevRecord.state.total.ratio ? (
                                    <ArrowDown className="h-3 w-3 text-red-600" />
                                  ) : null}
                                </>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {formatNumber(totalState.treasury.mckb)}
                            </span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.treasury.mckb,
                                    totalState.treasury.mckb
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.treasury.mckb,
                                        totalState.treasury.mckb
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.treasury.mckb,
                                  totalState.treasury.mckb
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatNumber(totalState.treasury.ckb)}</span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.treasury.ckb,
                                    totalState.treasury.ckb
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.treasury.ckb,
                                        totalState.treasury.ckb
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.treasury.ckb,
                                  totalState.treasury.ckb
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {formatNumber(totalState.treasury.debt)}
                            </span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.treasury.debt,
                                    totalState.treasury.debt
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.treasury.debt,
                                        totalState.treasury.debt
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.treasury.debt,
                                  totalState.treasury.debt
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatNumber(totalState.supply.mckb)}</span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.supply.mckb,
                                    totalState.supply.mckb
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.supply.mckb,
                                        totalState.supply.mckb
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.supply.mckb,
                                  totalState.supply.mckb
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatNumber(totalState.solvency.ckb)}</span>
                            {prevRecord && (
                              <span
                                className={`text-xs ${
                                  getChangeDisplay(
                                    prevRecord.state.solvency.ckb,
                                    totalState.solvency.ckb
                                  ).isIncrease
                                    ? "text-green-500"
                                    : getChangeDisplay(
                                        prevRecord.state.solvency.ckb,
                                        totalState.solvency.ckb
                                      ).display
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {getChangeDisplay(
                                  prevRecord.state.solvency.ckb,
                                  totalState.solvency.ckb
                                ).display || ""}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.notes || ""}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Combined Actor Management and Actions bar at the bottom */}
        <Card className="sticky bottom-0 z-10 border-t-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Actor & Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-end gap-4 flex-wrap">
              {/* Actor Management */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Actor</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={currentActorId}
                    onValueChange={setCurrentActorId}
                  >
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actors.map((actor) => (
                        <SelectItem key={actor.id} value={actor.id}>
                          {actor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Actor</DialogTitle>
                        <DialogDescription>
                          Create a new actor with initial state
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Actor Name</Label>
                          <Input
                            placeholder={`Actor ${actors.length + 1}`}
                            value={newActorName}
                            onChange={(e) => setNewActorName(e.target.value)}
                          />
                        </div>
                        <Button onClick={createActor} className="w-full">
                          Create
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="h-9 w-px bg-border" />

              {/* Actions */}
              <div className="flex flex-col gap-1 flex-1">
                <Label className="text-xs">Action</Label>
                <Select
                  value={selectedAction}
                  onValueChange={(value) => {
                    setSelectedAction(value);
                    setActionParams({});
                  }}
                >
                  <SelectTrigger className="w-[200px] h-9">
                    <SelectValue placeholder="Select an action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stake">Stake CKB</SelectItem>
                    <SelectItem value="mining_offering">
                      Mining Offering / Recruiting
                    </SelectItem>
                    <SelectItem value="repay">Repay CKB</SelectItem>
                    <SelectItem value="redeem">Redeem mCKB</SelectItem>
                    <SelectItem value="withdraw">Withdraw CKB</SelectItem>
                    <SelectItem value="interest">
                      Interests + Late Repay Penalty
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedAction && (
                <>
                  <div className="h-9 w-px bg-border" />
                  <div className="flex-1">{renderActionForm()}</div>
                </>
              )}

              <div className="h-9 w-px bg-border" />

              {/* Reset button */}
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={resetToInitial}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
