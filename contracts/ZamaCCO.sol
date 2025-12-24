// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ZamaCCO {
    using FHE for *;

    ZamaEthereumConfig public config;

    struct EncryptedProfile {
        euint32 encryptedIncome;
        euint32 encryptedCollateral;
        euint32 encryptedDebt;
        bool exists;
    }

    enum CreditTier { Poor, Fair, Good, Excellent }

    mapping(address => EncryptedProfile) private profiles;
    mapping(address => CreditTier) private publicTiers;

    event EncryptedProfileSubmitted(address indexed borrower);
    event CreditScoreComputed(address indexed borrower, CreditTier tier);
    event DecryptionRequested(address indexed borrower, address indexed lender);

    constructor(ZamaEthereumConfig _config) {
        config = _config;
    }

    function submitEncryptedData(
        externalEuint32 encryptedIncome,
        externalEuint32 encryptedCollateral,
        externalEuint32 encryptedDebt,
        bytes calldata inputProof
    ) external {
        euint32 inc = FHE.fromExternal(encryptedIncome, inputProof);
        euint32 col = FHE.fromExternal(encryptedCollateral, inputProof);
        euint32 det = FHE.fromExternal(encryptedDebt, inputProof);

        profiles[msg.sender] = EncryptedProfile({
            encryptedIncome: inc,
            encryptedCollateral: col,
            encryptedDebt: det,
            exists: true
        });

        emit EncryptedProfileSubmitted(msg.sender);
    }

    function computeCreditScore(address borrower) external {
        require(profiles[borrower].exists, "Profile not found");

        euint32 encInc = profiles[borrower].encryptedIncome;
        euint32 encCol = profiles[borrower].encryptedCollateral;
        euint32 encDet = profiles[borrower].encryptedDebt;

        euint32 sum = FHE.add(FHE.add(encInc, encCol), encDet);

        FHE.makePubliclyDecryptable(sum);

        emit CreditScoreComputed(borrower, CreditTier(0));
    }

    function requestDecryption(address borrower) external {
        require(profiles[borrower].exists, "Profile not found");
        emit DecryptionRequested(borrower, msg.sender);
    }

    function getPublicCreditTier(address borrower) external view returns (CreditTier) {
        require(profiles[borrower].exists, "Profile not found");
        return publicTiers[borrower];
    }
}

