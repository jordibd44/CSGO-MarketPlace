var NftMarketplace = artifacts.require("NftMarketplace");
var CsgoNFT = artifacts.require("csgoNFT"); // Agrega la referencia al contrato CsgoNFT

async function logNftLists(marketplace) {
    let listedNfts = await marketplace.getMyNfts({from: '0xA99E938CC3Be7c94bB88DDB6B788Fa8A0DC540E0'});
    console.log(`Listed NFTs: ${listedNfts.length}`);
    console.log('Listed NFTs:');
    console.log(listedNfts);
}


const main = async (cb) => {
  try {
    const marketplace = await NftMarketplace.deployed();
    const csgoNFT = await CsgoNFT.deployed(); // Obtén la instancia del contrato CsgoNFT

    await logNftLists(marketplace);
    

  } catch (err) {
    console.log('Error: ', err);
  }
  cb();
};

module.exports = main;

