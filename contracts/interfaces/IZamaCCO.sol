// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IZamaCCO {
    function submitBorrowerProfile(
        bytes calldata encryptedIncome,
        bytes calldata encryptedDebt,
        bytes calldata encryptedCollateral,
        bytes calldata inputProof
    ) external;

    function computeCreditScore() external;
}

