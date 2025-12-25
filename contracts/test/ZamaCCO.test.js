const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

/**
 * ZamaCCO Contract Test Suite
 * 
 * Note: These tests use mock implementations since FHE operations
 * require the Zama fhEVM environment. In production, use fhevm-hardhat-plugin
 * for full FHE testing capabilities.
 */
describe("ZamaCCO", function () {
  // Fixture to deploy the contract once and reuse across tests
  async function deployZamaCCOFixture() {
    const [owner, borrower, lender, thirdParty] = await ethers.getSigners();

    // Deploy mock config for testing
    // In production, this would be the actual ZamaEthereumConfig
    const MockConfig = await ethers.getContractFactory("MockZamaConfig");
    const mockConfig = await MockConfig.deploy();
    await mockConfig.waitForDeployment();

    const ZamaCCO = await ethers.getContractFactory("ZamaCCO");
    const zamaCCO = await ZamaCCO.deploy(await mockConfig.getAddress());
    await zamaCCO.waitForDeployment();

    return { zamaCCO, mockConfig, owner, borrower, lender, thirdParty };
  }

  describe("Deployment", function () {
    it("Should deploy successfully with correct config", async function () {
      const { zamaCCO, mockConfig } = await loadFixture(deployZamaCCOFixture);
      
      expect(await zamaCCO.config()).to.equal(await mockConfig.getAddress());
    });

    it("Should have correct initial state", async function () {
      const { zamaCCO, borrower } = await loadFixture(deployZamaCCOFixture);
      
      // Profile should not exist initially
      await expect(
        zamaCCO.getPublicCreditTier(borrower.address)
      ).to.be.revertedWith("Profile not found");
    });
  });

  describe("Profile Submission", function () {
    it("Should emit EncryptedProfileSubmitted event on submission", async function () {
      const { zamaCCO, borrower } = await loadFixture(deployZamaCCOFixture);
      
      // Mock encrypted data (in production, use fhEVM encryption)
      const mockEncryptedIncome = ethers.ZeroHash;
      const mockEncryptedCollateral = ethers.ZeroHash;
      const mockEncryptedDebt = ethers.ZeroHash;
      const mockProof = "0x";

      // This test demonstrates the expected event emission
      // Actual FHE tests require the fhevm-hardhat-plugin
      await expect(
        zamaCCO.connect(borrower).submitEncryptedData(
          mockEncryptedIncome,
          mockEncryptedCollateral,
          mockEncryptedDebt,
          mockProof
        )
      ).to.emit(zamaCCO, "EncryptedProfileSubmitted")
        .withArgs(borrower.address);
    });

    it("Should allow multiple submissions from same borrower (update)", async function () {
      const { zamaCCO, borrower } = await loadFixture(deployZamaCCOFixture);
      
      const mockData = ethers.ZeroHash;
      const mockProof = "0x";

      // First submission
      await zamaCCO.connect(borrower).submitEncryptedData(
        mockData, mockData, mockData, mockProof
      );

      // Second submission (update)
      await expect(
        zamaCCO.connect(borrower).submitEncryptedData(
          mockData, mockData, mockData, mockProof
        )
      ).to.emit(zamaCCO, "EncryptedProfileSubmitted");
    });
  });

  describe("Credit Score Computation", function () {
    it("Should revert if profile does not exist", async function () {
      const { zamaCCO, borrower, lender } = await loadFixture(deployZamaCCOFixture);
      
      await expect(
        zamaCCO.connect(lender).computeCreditScore(borrower.address)
      ).to.be.revertedWith("Profile not found");
    });

    it("Should emit CreditScoreComputed after successful computation", async function () {
      const { zamaCCO, borrower, lender } = await loadFixture(deployZamaCCOFixture);
      
      // Submit profile first
      const mockData = ethers.ZeroHash;
      await zamaCCO.connect(borrower).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );

      // Compute credit score
      await expect(
        zamaCCO.connect(lender).computeCreditScore(borrower.address)
      ).to.emit(zamaCCO, "CreditScoreComputed");
    });

    it("Should allow any address to request computation", async function () {
      const { zamaCCO, borrower, thirdParty } = await loadFixture(deployZamaCCOFixture);
      
      const mockData = ethers.ZeroHash;
      await zamaCCO.connect(borrower).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );

      // Third party can trigger computation
      await expect(
        zamaCCO.connect(thirdParty).computeCreditScore(borrower.address)
      ).to.emit(zamaCCO, "CreditScoreComputed");
    });
  });

  describe("Decryption Requests", function () {
    it("Should revert if profile does not exist", async function () {
      const { zamaCCO, borrower, lender } = await loadFixture(deployZamaCCOFixture);
      
      await expect(
        zamaCCO.connect(lender).requestDecryption(borrower.address)
      ).to.be.revertedWith("Profile not found");
    });

    it("Should emit DecryptionRequested event", async function () {
      const { zamaCCO, borrower, lender } = await loadFixture(deployZamaCCOFixture);
      
      // Submit profile first
      const mockData = ethers.ZeroHash;
      await zamaCCO.connect(borrower).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );

      await expect(
        zamaCCO.connect(lender).requestDecryption(borrower.address)
      ).to.emit(zamaCCO, "DecryptionRequested")
        .withArgs(borrower.address, lender.address);
    });

    it("Should allow borrower to request their own decryption", async function () {
      const { zamaCCO, borrower } = await loadFixture(deployZamaCCOFixture);
      
      const mockData = ethers.ZeroHash;
      await zamaCCO.connect(borrower).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );

      await expect(
        zamaCCO.connect(borrower).requestDecryption(borrower.address)
      ).to.emit(zamaCCO, "DecryptionRequested")
        .withArgs(borrower.address, borrower.address);
    });
  });

  describe("Access Control", function () {
    it("Should not expose encrypted data directly", async function () {
      const { zamaCCO, borrower } = await loadFixture(deployZamaCCOFixture);
      
      // The profiles mapping is private, so no direct access
      // This ensures data privacy at the contract level
      expect(zamaCCO.interface.getFunction("profiles")).to.be.null;
    });
  });

  describe("Gas Optimization", function () {
    it("Should have reasonable gas costs for submission", async function () {
      const { zamaCCO, borrower } = await loadFixture(deployZamaCCOFixture);
      
      const mockData = ethers.ZeroHash;
      const tx = await zamaCCO.connect(borrower).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );
      const receipt = await tx.wait();
      
      // Log gas used (for optimization tracking)
      console.log(`Gas used for submitEncryptedData: ${receipt.gasUsed}`);
      
      // Ensure gas is within reasonable bounds (adjust based on requirements)
      expect(receipt.gasUsed).to.be.lessThan(500000);
    });
  });
});

describe("Integration Tests", function () {
  async function deployZamaCCOFixture() {
    const [owner, borrower1, borrower2, lender] = await ethers.getSigners();

    const MockConfig = await ethers.getContractFactory("MockZamaConfig");
    const mockConfig = await MockConfig.deploy();

    const ZamaCCO = await ethers.getContractFactory("ZamaCCO");
    const zamaCCO = await ZamaCCO.deploy(await mockConfig.getAddress());

    return { zamaCCO, owner, borrower1, borrower2, lender };
  }

  describe("Full User Journey", function () {
    it("Should complete full credit scoring flow", async function () {
      const { zamaCCO, borrower1, lender } = await loadFixture(deployZamaCCOFixture);
      
      const mockData = ethers.ZeroHash;
      
      // Step 1: Borrower submits encrypted data
      await expect(
        zamaCCO.connect(borrower1).submitEncryptedData(
          mockData, mockData, mockData, "0x"
        )
      ).to.emit(zamaCCO, "EncryptedProfileSubmitted");

      // Step 2: Lender requests credit score computation
      await expect(
        zamaCCO.connect(lender).computeCreditScore(borrower1.address)
      ).to.emit(zamaCCO, "CreditScoreComputed");

      // Step 3: Lender requests decryption
      await expect(
        zamaCCO.connect(lender).requestDecryption(borrower1.address)
      ).to.emit(zamaCCO, "DecryptionRequested");
    });

    it("Should handle multiple borrowers independently", async function () {
      const { zamaCCO, borrower1, borrower2, lender } = await loadFixture(deployZamaCCOFixture);
      
      const mockData = ethers.ZeroHash;

      // Both borrowers submit
      await zamaCCO.connect(borrower1).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );
      await zamaCCO.connect(borrower2).submitEncryptedData(
        mockData, mockData, mockData, "0x"
      );

      // Lender can interact with both independently
      await expect(
        zamaCCO.connect(lender).computeCreditScore(borrower1.address)
      ).to.emit(zamaCCO, "CreditScoreComputed");

      await expect(
        zamaCCO.connect(lender).requestDecryption(borrower2.address)
      ).to.emit(zamaCCO, "DecryptionRequested");
    });
  });
});
