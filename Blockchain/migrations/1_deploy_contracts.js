var csgoNFT = artifacts.require("csgoNFT");
var NftMarketplace = artifacts.require("NftMarketplace");

module.exports = async function(deployer) {
  await deployer.deploy(NftMarketplace);
  const marketplace = await NftMarketplace.deployed();
  await deployer.deploy(csgoNFT, marketplace.address);
}

