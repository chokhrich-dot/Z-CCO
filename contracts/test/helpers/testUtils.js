const { ethers } = require("hardhat");

/**
 * Test utilities for ZamaCCO contract testing
 */

/**
 * Generate mock encrypted data for testing
 * In production, use actual FHE encryption from fhevm
 */
function generateMockEncryptedData() {
  return {
    encryptedIncome: ethers.ZeroHash,
    encryptedCollateral: ethers.ZeroHash,
    encryptedDebt: ethers.ZeroHash,
    proof: "0x",
  };
}

/**
 * Credit tier enum mapping
 */
const CreditTier = {
  Poor: 0,
  Fair: 1,
  Good: 2,
  Excellent: 3,
};

/**
 * Helper to check if an address has a profile
 */
async function hasProfile(contract, address) {
  try {
    await contract.getPublicCreditTier(address);
    return true;
  } catch (error) {
    if (error.message.includes("Profile not found")) {
      return false;
    }
    throw error;
  }
}

/**
 * Helper to submit a profile for testing
 */
async function submitTestProfile(contract, signer) {
  const mockData = generateMockEncryptedData();
  const tx = await contract.connect(signer).submitEncryptedData(
    mockData.encryptedIncome,
    mockData.encryptedCollateral,
    mockData.encryptedDebt,
    mockData.proof
  );
  return tx;
}

/**
 * Wait for a specific event from a transaction
 */
async function getEventFromTx(tx, eventName) {
  const receipt = await tx.wait();
  const event = receipt.logs.find(
    (log) => log.fragment && log.fragment.name === eventName
  );
  return event;
}

module.exports = {
  generateMockEncryptedData,
  CreditTier,
  hasProfile,
  submitTestProfile,
  getEventFromTx,
};
