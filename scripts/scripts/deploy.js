const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying Marketplace contracts...");

  const MarketplaceToken = await hre.ethers.getContractFactory("MarketplaceToken");
  const paymentToken = await MarketplaceToken.deploy();
  await paymentToken.deployed();
  console.log("✅ MarketplaceToken deployed to:", paymentToken.address);

  const ZKProofValidator = await hre.ethers.getContractFactory("ZKProofValidator");
  const zkValidator = await ZKProofValidator.deploy();
  await zkValidator.deployed();
  console.log("✅ ZKProofValidator deployed to:", zkValidator.address);

  const MarketplaceEscrow = await hre.ethers.getContractFactory("MarketplaceEscrow");
  const marketplace = await MarketplaceEscrow.deploy();
  await marketplace.deployed();
  console.log("✅ MarketplaceEscrow deployed to:", marketplace.address);

  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      MarketplaceToken: paymentToken.address,
      ZKProofValidator: zkValidator.address,
      MarketplaceEscrow: marketplace.address,
    },
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
