# 🛡 ZamaCCO Smart Contracts
---

![Alt text](cco-banner.png)


---

This directory hosts the core **ZamaCCO** smart contracts powering the **Confidential Credit Oracle (CCO)** system.

These contracts are designed with **privacy-first principles** and leverage **Zama FHEVM** for fully homomorphic encryption on-chain.

---

## 📄 Main Contract

### `ZamaCCO.sol`
- Privacy-preserving credit score computation.
- Accepts **FHE-encrypted borrower inputs**: income, collateral, debt.
- Computes **public credit tiers** while keeping sensitive data encrypted.
- Supports controlled decryption for authorized parties.
- Includes event logs:  
  - `EncryptedProfileSubmitted`  
  - `CreditScoreComputed`  
  - `DecryptionRequested`  

### Helper Interfaces & Storage
- `IZamaCCO.sol` — Standard interface for frontend integration.
- `ZamaCCOStorage.sol` — Modular storage layout for upgradeability.

---

## 🌐 Network & Deployment

- **Target Network:** fhEVM Sepolia (Zama Testnet)  
- **Status:** Compiled and tested in Remix  
- **Deployment Ready:** ✅  

**Deployed Contract Example:**  
| Contract | Address | Explorer |
|----------|---------|---------|
| ZamaCCO | `0x0A0656Fe438602D20A1d6783dcEe838e430Ade9A` | [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x0a0656fe438602d20a1d6783dcee838e430ade9a) |

---

## ⚡ Implementation Highlights

- Full **on-chain FHE credit scoring** workflow.
- Event-driven UI updates for borrower actions.
- Encrypted input handling with **audit-proof logging**.
- Ready for **integration with React + Wagmi/viem frontend**.
- Modular structure allows seamless future upgrades.

---

## 🛠 Getting Started

1. Open contracts in [Remix](https://remix.ethereum.org/).
2. Compile `ZamaCCO.sol` with Solidity 0.8.x.
3. Deploy to **fhEVM Sepolia** testnet.
4. Use interfaces (`IZamaCCO.sol`) for frontend connection.

---

## 🔐 Notes

- All sensitive borrower data remains encrypted on-chain.
- Public credit tier computations are transparent and verifiable.
- Only authorized decryption requests are allowed.

---

Crafted with 💛 by **chokhrich** (@chokhrich1)
