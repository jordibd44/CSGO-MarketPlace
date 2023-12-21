const Web3 = require('web3');
const CSGONFTContract = require('./build/csgoNFT.json');
const NftMarketplaceContract = require('./build/NftMarketplace.json');
const web3 = new Web3('http://localhost:8545');
let csgoNFTContract;
let nftMarketplaceContract;
const accountAddress = '0xA99E938CC3Be7c94bB88DDB6B788Fa8A0DC540E0'; 
const vendedor = '0x4aAED7cA70d287F2a475aB66D12bc5c0F10ceCBf';

async function getListingFee() {
  const listingFee = await nftMarketplaceContract.methods.LISTING_FEE().call({ from: accountAddress });
  console.log('Listing Fee:', listingFee);
  return listingFee;
}

async function mintAndListNFT(uri, tokenId, title, description) {
  const listingFee = await getListingFee();
  // Mint NFT
  await csgoNFTContract.methods.mint(uri).send({ from: accountAddress, gas: 900000 });

  // List NFT in the marketplace
  await nftMarketplaceContract.methods.listNft(
    csgoNFTContract.options.address,
    tokenId,
    1,
    title,
    description,
  ).send({ from: accountAddress, value: listingFee, gas: 900000 });

  console.log(`NFT with URI ${uri} minted and listed successfully.`);
}

async function main() {

	await web3.eth.net.getId()
    .then(networkId => {
        csgoNFTContract = new web3.eth.Contract(CSGONFTContract.abi, CSGONFTContract.networks[networkId].address);
        nftMarketplaceContract = new web3.eth.Contract(NftMarketplaceContract.abi, NftMarketplaceContract.networks[networkId].address);
    })
    .catch(error => {
        console.log('Error al obtener datos:', error);
    });
  await mintAndListNFT("URI1", 1, "Title 1", "Description 1");
  await mintAndListNFT("URI2", 2, "Title 2", "Description 2");
  await mintAndListNFT("URI3", 3, "Title 3", "Description 3");

  const tokenIdToBuy = 3;
  const amount = web3.utils.toWei('2', 'ether'); 
  try {
    await nftMarketplaceContract.methods.buyNft(csgoNFTContract.options.address, tokenIdToBuy).send({ value: amount, from: vendedor, gas:9000000 });
    console.log('Compra exitosa.');
  } catch (error) {
    console.error('Error al comprar NFT:', error);
  }
  const tokenIdToUnList = 2; 
  try {
    await nftMarketplaceContract.methods.unListNFT(tokenIdToUnList).send({ from: accountAddress, gas: 900000 });
    console.log('unlist exitosa.');
    await nftMarketplaceContract.methods.ReListNFT(tokenIdToUnList).send({ from: accountAddress, gas: 900000 });
    console.log('volvemos a listar')
  } catch (error) {
    console.error('Error unlist:', error);
  }
  

  const balance = await web3.eth.getBalance(accountAddress);
  console.log('Nuevo balance en Ether:', web3.utils.fromWei(balance, 'ether'));
}

main().catch((error) => console.error(error));

