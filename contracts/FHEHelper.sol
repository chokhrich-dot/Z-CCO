// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@fhevm/solidity/contracts/FHE.sol";

library FHEHelper {
    function asEuint32(bytes calldata input) internal returns (euint32) {
        return FHE.asEuint32(input);
    }

    function asEbool(bytes calldata input) internal returns (ebool) {
        return FHE.asEbool(input);
    }
}
