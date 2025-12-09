# CKB Miner CDP

Combine CKB mining and collateralized debt positions (CDPs) to let miners access credit, liquidity, and pre-sold demand while buyers gain exposure to discounted hash rate production. The protocol aims to converge DeFi capital markets with DePin cash flows rather than treating mining and finance as disconnected silos.

## Overview

1. Collateral providers lock iCKB or other approved assets (CKB, stablecoins, BTC, staked assets, etc.) in vaults.
2. Vault owners mint `mCKB`, a synthetic claim on future block rewards, up to a protocol-defined loan-to-value ratio.
3. Miners purchase or receive `mCKB` to secure presold CKB at a discount, prepay commitments, or tokenized hash rate.
4. As mining yields real CKB, vault owners repay their `mCKB` debt plus stability fees. If a vault’s individual collateral ratio (ICR) falls below thresholds, liquidators seize collateral and extinguish debt.

## Participants and Incentives

- **Collateral providers / leverage seekers**: Open CDPs with iCKB or other assets to gain leverage on forthcoming mining returns or to finance rigs. iCKB is one collateral type among many, useful when depositors want staking yield plus borrowing power.
- **Miners**: Swap discounted `mCKB` for cash flow to cover capex/opex, commit to settlement periods, and earn lower pool premiums when keeping high ICRs.
- **Liquidity buyers & speculators**: Trade `mCKB` anticipating price convergence with spot CKB, or use it as collateral in other DeFi venues.
- **Keepers / liquidators**: Maintain system solvency by bidding on under-collateralized vaults, potentially receiving mining commitments or collateral at a discount.
- **Eco System**: Reduce price fluctuation; value binding with other collaterals; incentivize holding CKB.

## Collateral and Token Design

- Multi-collateral: start with liquid assets (iCKB, native CKB, stablecoins) and progressively add tokenized hash contracts or treasury bills.
- Stability fees: dynamic rates paid in CKB or stable assets to balance borrowing demand with risk.
- Settlement asset: `mCKB` can redeem 1:1 for freshly mined CKB delivered at maturity or via AMM liquidity once vault debt is repaid.
- Premium controls: the protocol can subsidize miners with higher ICR or longer lockups by returning portions of fees or providing additional `mCKB` emissions.

## Lifecycle

1. **Deposit & mint**: A miner deposits 10,000 iCKB and 20,000 USDC to mint 15,000 `mCKB`, targeting a 200% ICR.
2. **Distribution**: `mCKB` is sold OTC or through an order book to presale buyers seeking discounted future CKB. Liquidity pools allow secondary trading and hedging.
3. **Mining & reporting**: Miner points hash rate toward a coordinated pool that tracks future reward commitments. Pool payouts accrue to a repayment module controlled by the CDP.
4. **Repay & redeem**: Generated CKB repays the `mCKB` debt; any surplus returns to the miner. Buyers redeem `mCKB` for actual CKB at the promised discount or roll positions into future rounds.
5. **Liquidation path**: If collateral value drops and ICR < 150% (configurable), automated auctions sell part of the collateral, or the protocol assigns mining power to a standby operator to ensure reward delivery.

## Scenario 1: Presale + Prebuy

- Goal: turn mining output into tradeable presale tickets without forcing miners to sell equity or operate at a loss.
- Flow: Miners or financiers open CDPs, mint `mCKB`, and distribute it as a presold claim on discounted CKB (e.g., 5–15% below projected spot) with clear delivery windows.
- Safeguards: Vault-specific ICR requirements, oracle feeds for collateral valuation, auto-liquidation via Dutch auctions, and emergency halts for extreme hash rate shocks.
- Benefits: Buyers obtain leveraged exposure to future rewards, miners receive upfront capital, and the protocol earns fees proportional to outstanding `mCKB`.

## Scenario 2: Coordinated Mining

- Premium curve: Pool fees decrease as vault ICR increases (e.g., ICR ≥ 300% ⇒ 0% premium, 200–300% ⇒ 0.5%, below 200% ⇒ 1%+). Longer settlement periods unlock further discounts because capital is locked with more certainty.
- Commitment contracts: Miners stake `mCKB` or collateral to guarantee hash rate for a target duration; failure to deliver triggers collateral slashing that subsidizes other participants.
- Treasury role: Fees collected from lower-ICR miners form an insurance fund to cover volatility or subsidize high-ICR operators, aligning incentives toward over-collateralization.

## Scenario 3: Tokenized Mining

- Fractional hash rate: `mCKB` holders can directly convert their tokens into fractional shares of mining rigs or hosted hash power, enabling precise scaling without purchasing entire machines.
- Cross-chain reach: The same CDP logic can underwrite BTC, ETH, or other ASIC/GPU mining operations by adapting settlement assets (`mBTC`, `mETH`, etc.) while keeping the collateral engine unified.
- Secondary markets: Tokenized mining shares can be pooled, staked, or used as collateral elsewhere, letting capital rotate between DeFi and physical mining infrastructure.

## Scenario 4: Redeemable Mining Plan

- Third party can redeem a mining plan with available mCKB prematurely;

## Scenario 5: Miner loan

## Risk and Open Questions

- Oracle risk: Need resilient price feeds for every collateral type plus metrics for hash rate commitments.
- Settlement enforcement: Define legal/contractual hooks to ensure miners deliver rewards or allow the protocol to redirect hardware.
- Interest rate discovery: Determine how to set stability fees and presale discounts dynamically based on demand and network conditions.
- Regulatory surface: Tokenizing real-world mining could trigger securities/commodities oversight; governance must plan structures that are jurisdiction-aware.

CKB Miner CDP blends capital efficiency from CDPs with the tangible output of mining operations. By diversifying collateral (with iCKB as just one option) and clearly defining flows between miners, speculators, and liquidators, the protocol can create a unified marketplace for financing current and future hash rate.
