# Liquidation

- Foundational safety mechanism: miners need to maintain a ICR (Individual Collateral Ratio) higher than MCR (Minimum Collateral Ratio) to avoid liquidation; triggers liquidation automatically when ICR is lower than MCR (Minimum Collateral Ratio);
- Multi-Collateralization: different types of collaterals are allowed for an aggregated ICR;
  - Aggregated MCR (Minimum Collateral Ratio) should be calculated as a weighted average of the collaterals;
- Liquidation Path:
  - Unlike in Liquity, liquidated assets goes to the stability pool meanwhile individual debts are cleared;
- Repay gets boosted if repaying with CKB mined with our pool;
- Debts yield interests at a fixed + self-defined rate; higher self-defined rate would be less likely to be redeemed;

