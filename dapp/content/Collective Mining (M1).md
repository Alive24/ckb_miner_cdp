# Collective Mining (M1)

## Overview

In Milestone 1, we aim to implement collective mining for CKB that:

1. Tokenise mining into offering and recruiting;
2. Split mining rewards into sponsoring and redeeming thus anonymous/collective ;
3. Allow early settlement before actual rewards for liquidity and speculation;
4. Promise solvency and yield protocol revenue with liquidation and redemption by treasury;

Milestone 1 allows only CKB as collaterals at this stage which means that ICR won't fluctuate against price volatility and solvency is guaranteed in this case;

Estimated to take around 4 months.

Milestone 1.1: Mining Schedules

Milestone 1.2: Redemption

Milestone 1.3: Treasury and Interests

Milestone 1.4: Collateral Ratio and Liquidation

### Mining Schedules: Mining Offering / Mining Recruiting

- Miners can register as mining providers by depositing collaterals and keeping a liquidation deposit;
- After registration, mining provider can propose mining offering at its own price and volume to allow mining sponsors to mint mining contract tokens (e.g, mCKB):
  - Mining provider can set price in either CKB or stable coins against mCKB by absolute price or relative price;
  - Mining provider receives payments immediately; Mining sponsor receives mining contract tokens immediately;
  - Debt are recorded to Mining Provider in CKB 1:1 to mCKB;
  - Global fixed rates apply;
- The Mining provider maintains a secure Individual Collateral Ratio (ICR) by depositing enough collaterals against its debt or it will face liquidation;
- Similarly, mining sponsors can propose a mining recruiting at its own price and volume with funding to allow mining providers to mint mining contract tokens to the sponsor;
- Multi-level pricing.
- Balance based perpetual contract.
- Different tiers of fee: Different 0 interest span and different penalty rate.

### Redemption

- Holders of mining contract tokens can redeem them for the CKB 1:1 for the collaterals in the protocol pool;
- Redemption can take different time length (instant, 1 day, 7 days, 14 days, 28 days) at different fee rate
  - Redeem to iCKB by default; extra waiting time might apply for CKB.
- Redemption targets are selected based on their ICR;
  - (Milestone 2): Mining providers can set an additional interest rate to move further back in the redemption queue.

### Individual Collateral Ratio Management and Liquidation

- At any time, mining providers are obliged to maintain a healthy ICR or the collaterals will be liquidated; to do so, mining providers can stake more collaterals or repay debts; you can use mCKB or CKB to repay at 1% fee or directly mine to the protocol. By mining directly to repay or collateral, you enjoy a 0% fee.
- Recovery Mode
  - Mining Provider in Recovery Mode: When ICR < CCR, the mining provider will be put into recovery mode;
  - Global Recovery Mode: `Total Collateralization Ratio` may fall below `Critical Collateralization Ratio`. When TCR < CCR, the protocol will enter global recovery mode;
  - In recovery mode, actions that would lower ICR (For single mining provider in recovery mode) / TCR (For global recovery mode) will be blocked;
  - Would be redeemee before treasury.
- Liquidation: When liquidation happens, insolvent mining providers lose their collaterals and liquidation reserve to the treasury and cleared their debt;
  - Soft liquidation: When ICR falls below CCR, daily soft liquidation would happen until ICR goes up above CCR; 5% debt will be repaid with 5% \* MCR worth of collaterals. At the same time, additional recovery mode fee applies.
  - Hard liquidation: When ICR continues to fall and reached MCR, hard liquidation would happen; All debt would be repaid with all collaterals plus liquidation reserve.

### Treasury

- Treasury is a public actor in the protocol that mitigates solvency risks and yields protocol revenue for the purpose of building an independent and self-sustainable DAO;
- In liquidation either soft or hard, instead of redistribution, it takes over the liquidated collaterals and debt, and act as the foundational target for redemption.
- It automatically arbitrages when depeg happens.
  - Sell mCKB to markets when mCKB worths more than CKB.
  - Buy mCKB from markets when mCKB worths less than the minimal price in the protocol.
- Protocol Revenue:
  - Mining Offering Fee: Fee for mining providers to propose mining offering;
  - Mining Recruiting Fee: Fee for mining sponsors to propose mining recruiting;
  - Redemption Fee: Fee for holders of mCKB to redeem for iCKB/CKB;
  - Liquidation Fee: Liquidation reserve for liquidators to liquidate mining providers;
  - Recovery Mode Fee: Fee for mining providers to get out of recovery mode;
