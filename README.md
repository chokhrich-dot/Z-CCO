# 🔐 Z-CCO: Zama Confidential Credit Oracle

[![Zama](https://img.shields.io/badge/Zama-FHE-blue)](https://zama.ai) 
[![FHE](https://img.shields.io/badge/FHE-Encrypted-green)](https://zama.ai/fhevm) 
[![Web3](https://img.shields.io/badge/Web3-Compatible-purple)](https://ethereum.org/en/developers/docs/)

---

![Alt text](./path/to/your/image.jpg)


---

## 🔥 Project Description

**Z-CCO** is a next-generation privacy-first credit scoring platform built on **Zama FHEVM**.  
It allows borrowers to submit fully encrypted financial data (income, collateral, debt) while preserving confidentiality. Lenders can compute credit scores and request selective decryption **without 
exposing sensitive information**.  

👾[LIVE DEMO]()

🎞️[DEMO VIDEO]()

---

## 🔑Key highlights:  

- **FHE-encrypted financial data:** Full homomorphic encryption for privacy.  
- **On-chain credit scoring:** All computations are verifiable and transparent on the blockchain.  
- **Responsive UI & modern design:** Built with React, Vite, Tailwind CSS, shadcn-ui.  
- **Web3 Integration:** MetaMask + WalletConnect via Wagmi & Viem.  
- **Investor-ready documentation:** Pitch Deck, Whitepaper v1, Architecture diagram, Demo scripts.  

---
## 🚀 Implementation Status

| Component                       | Status          | Notes                                        |
|---------------------------------|----------------|----------------------------------------------|
| Smart Contracts (ZamaCCO.sol)   | ✅ Completed   | Deployed on FHEVM Sepolia                    |
| Frontend UI                      | ✅ Completed   | React + Tailwind + Shadcn UI                 |
| Web3 Integration                 | ✅ Completed  | WalletConnect & Viem integration pending    |
| Event listeners & Dashboard      | ✅ Completed  | EncryptedProfileSubmitted, CreditScoreComputed, DecryptionRequested |
| Documentation                    | ⚠ In Progress | Whitepaper v1, Pitch Deck, Demo Script      |


---
## 🗂 Repository Layout

```bash

Z-CCO/
├── README.md # Project overview
├── contracts/  # Smart contracts
  ├── ZamaCCO.sol
  ├── ZamaCCOStorage.sol
  ├── ZamaCCOEvents.sol
  ├── FHEHelper.sol
  ├── interfaces/
  │   └── IZamaCCO.sol
  └── README.md
├── index.html
├── package.json
├── src/
│    └── ...
├── docs/ # Documentation & design assets
│    ├── architecture.svg # Architecture diagram
│    ├── demo-script.md
│    ├── pitch-deck.md
│    └── whitepaper.md

```
----

## 🏗 Architecture Overview

```bash
+-----------------+          +----------------+          +------------------+
|    Borrower     |  ---->   |   ZAMA CCO     |  ---->   |      Lender      |
|  (encrypted)    |          |  Smart Contract|          |  (authorized)    |
+-----------------+          +----------------+          +------------------+

SVG diagram: docs/architecture.svg
```

## 🔑Key Components:

ZamaCCO Smart Contract: Handles encrypted data submission, credit score computation, and decryption requests.

UI Dashboard: Interactive frontend for borrowers and lenders with privacy-first animations.

Web3 Layer: Wagmi + Viem for wallet connectivity and transaction management.

Event Listeners: Real-time updates for EncryptedProfileSubmitted, CreditScoreComputed, DecryptionRequested.




---

## 🚀Getting Started

### 🔶Prerequisites

- Node.js >= 22.x (LTS)  
- npm or bun  
- MetaMask or WalletConnect-compatible wallet  
- Sepolia ETH for testnet deployment  

###

1️⃣ Clone the repository
```bash
git clone https://github.com/chokhrich1/Z-CCO.git
cd Z-CCO
```
2️⃣ Install dependencies
```bash
cd ui
npm install
# or if using bun
bun install
```
3️⃣ Configure environment
```bash
Create a .env file in ui/:

VITE_WALLETCONNECT_PROJECT_ID=<your_project_id>
VITE_ZAMACCO_ADDRESS=<deployed_contract_address>
```

4️⃣ Run the frontend
```bash
npm run dev
# or
bun dev

Open http://localhost:5173 to see the app.
```

5️⃣ Deploy Smart Contract (if not already deployed)
```bash
Use Remix, Hardhat, or Foundry targeting fhEVM Sepolia / Zama testnet.
Add the deployed contract address in .env as VITE_ZAMACCO_ADDRESS.
```

---

## 📄 Documentation

✔️Architecture Diagram → /docs/architecture.svg

✔️Pitch Deck → /docs/pitch-deck.md
 – Investor-ready presentation

✔️Whitepaper v1 → /docs/whitepaper.md
 – Full protocol & architecture details

✔️Demo Script → /docs/demo-script.md
 – Step-by-step demo instructions


---

## 💻 Tech Stack

🟢 Frontend: React, Vite, Tailwind CSS, shadcn-ui

🟢 Blockchain: Zama FHEVM, Solidity

🟢 Web3 Integration: Wagmi, Viem

🟢 Encryption: Full Homomorphic Encryption (FHE)


---

## 🌐Network

fhEVM Sepolia (Zama Testnet)
Fully compatible with Zama FHEVM v0.8+

---
## 📦 Deployed Contract

| Contract Name | Address | Explorer Link |
|---------------|---------|---------------|
| ZamaCCO       | `0x0A0656Fe438602D20A1d6783dcEe838e430Ade9A` | [View on Etherscan](https://sepolia.etherscan.io/address/0x0a0656fe438602d20a1d6783dcee838e430ade9a) |

---

## 🚀 Roadmap

 🟨 Encrypted credit computation
 
 🟨 Privacy-first dashboard UI
 
 🟨 Smart contract deployment (Testnet)
 
 🟨 Lender access control
 
 🟨 ZK reputation aggregation
 
 🟨 Mainnet readiness

----
## ⚡ Contributing

Contributions are welcome! Please open an issue or a pull request.
Maintain privacy-first principles when handling sensitive data.


---
## 📚 Key Zama Resources

| Resource | Link |
|----------|------|
| **FHEVM GitHub** – Official repo with contracts & types | [GitHub](https://github.com/zama-ai/fhevm) |
| **v0.8 Release Notes** – Latest features & migration guide | [Release](https://github.com/zama-ai/fhevm/releases/tag/v0.8.0) |
| **Solidity Development Guide** – Step-by-step dev instructions | [Docs](https://docs.zama.ai/protocol/solidity-guides/development-guide/migration) |
| **Change Log** – Updates, fixes, improvements | [Changelog](https://docs.zama.org/change-log) |
| **Platform Status** – Testnet & RPC availability | [Status](https://status.zama.ai/) |

> Essential references for building ZamaCCO contracts, FHE workflows, and on-chain credit scoring.

---

## ©️License

This project is licensed under the MIT License.
See LICENSE for details.
---

## 📣 Contact

x acount= [chokhrich1](https://x.com/chokhrich1)

---

