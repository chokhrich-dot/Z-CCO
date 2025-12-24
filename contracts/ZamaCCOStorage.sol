// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/zama-ai/fhevm/blob/main/library-solidity/lib/FHE.sol";

contract ZamaCCOStorage {
    struct Borrower {
        euint32 income;
        euint32 debt;
        euint32 collateral;
        bool exists;
    }

    mapping(address => Borrower) internal borrowers;

    
    function addBorrower(
        address borrower,
        euint32 income,
        euint32 debt,
        euint32 collateral
    ) external {
        borrowers[borrower] = Borrower({
            income: income,
            debt: debt,
            collateral: collateral,
            exists: true
        });
    }
}







