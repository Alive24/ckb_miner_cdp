# CKB Miner CDP

Combine CKB mining and collateralized debt positions (CDPs) to implement decentralized and tokenized mining for the community and mining-specific DeFi services.

## Overview

### Initiatives

- Decentralization: Mining, Speculating, Leveraging, Settlement.
- Mining-Specific DeFi: Mining Offering, Mining Recruiting
- Collateralization: Liquidation, Redemption, Stability Pool
- Community: Open-source; Fund DAO; Price stabilization;

### Roles

- Basic Roles:
  - Mining Provider
  - Mining Sponsor
  - Redeemee
  - Liquidity Provider
- Protocol Role:
  - Liquidator
  - Redeemer

## Modules

### Mining Offering / Mining Recruiting

- Miners can register as mining providers by staking collaterals and keeping a liquidation deposit;
- After registration, mining provider can propose mining offering at its own price and volume to allow mining sponsors to mint mining contract tokens (e.g, mCKB):
  - Mining provider receives assets immediately; Mining sponsor receives mining contract tokens immediately;
  - Debt are recorded to Mining Provider in target asset 1:1 to the mining contract token;
  - Global fixed rates apply;
- The Mining provider maintains a secure Individual Collateral Ratio (ICR) by staking enough collaterals against its debt or it will face liquidation;
- Similarly, mining sponsors can propose a mining recruiting at its own price and volume with deposits (Not stake) to allow mining providers to mint mining contract tokens to the sponsor;

### Redemption

- Holders of mining contract tokens can redeem them for the target asset 1:1 for the collaterals in the protocol treasury;
- Redemption can take 7 and 28 days at different fee rate.
- Mining providers can set an additional interest rate to move further back in the redemption queue.
- Redemption targets are selected based on the miners' additional interest rate and then their ICR;

### Individual Collateral Ratio and Liquidation

- At any time, mining providers are obliged to maintain a healthy ICR or the collaterals will be liquidated;
  - To do so, mining providers can stake more collaterals or repay debts with target asset;
- When liquidation happens, insolvent mining providers lost all their collaterals to the treasury and cleared their debt;

### Liquidity Providers

- Incentives for Liquidity Provider:
  - Quick Redemption with Fee
  - Liquidation rewards
  - Liquidity reward token: discount fee

### Treasury

- Collaterals in the treasury are always one of the following:
  1. Liquidity Providers;
  2. Target assets from repay;
  3. Collaterals owned by the protocol from liquidation;
  4. Collaterals staked by mining providers;
- Usage Scope and Precedence (// Key for Design):
  - Withdraw from Staking: 4;
  - Redemption:
    - Default: 4 (Sorted by interest and ICR) -> 2;
    - Quick with Fee: 1 -> 2;
  - Liquidation: 1 + 2 + 3;

### Recovery Mode

- Mining Provider in Recovery Mode: When ICR < CCR, the mining provider will be put into recovery mode;
- Global Recovery Mode: As we accept multiple collateralization, `Total Collateralization Ratio` may fall below `Critical Collateralization Ratio`;
  - When TCR < CCR, the protocol will enter global recovery mode;
- In recovery mode, actions that would lower ICR (For single mining provider in recovery mode) / TCR (For global recovery mode) will be blocked;

### Protocol Revenue

- Protocol yields revenue for the purpose of building an independent and self-sustainable DAO;
- Sources of Revenue:
  - Mining Offering Fee: Fee for mining providers to propose mining offering;
  - Mining Recruiting Fee: Fee for mining sponsors to propose mining recruiting;
  - Redemption Fee: Fee for holders of mining contract tokens to redeem them;
  - Liquidation Fee: Fee for liquidators to liquidate mining providers;
  - Recovery Mode Fee: Fee for mining providers to get out of recovery mode;

### Mining Pool Integration

- Fee Deduction:
  - When repaying with CKB mined with our pool, repay gets boosted;
  - When providing liquidity by directly mining with our pool, earns a bigger share of the liquidation rewards;
- Protocol Token: Earn protocol token by mining with our pool;

### Protocol Token

- Earn protocol token by mining with our pool or being a liquidity provider;
- Protocol token can be used to waive fees;
- Stake protocol token and user can buy protocol token to waive fees;

## Potential Modules

- Multiply: One-click Restaking for CKB exposure;
- Loan: Loan CKB(iCKB) by staking CKB or other collaterals;