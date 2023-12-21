var NftMarketplace = artifacts.require("NftMarketplace");
var CsgoNFT = artifacts.require("csgoNFT"); 

async function logNftLists(marketplace) {
    let listedNfts = await marketplace.getListedNfts();
    let myNfts = await marketplace.getMyNfts();
    console.log(`Listed NFTs: ${listedNfts.length}`);
    console.log(`My NFTs: ${myNfts.length}\n`);
    console.log('Listed NFTs:');
    console.log(listedNfts);
    console.log('My NFTs:');
    console.log(myNfts);
}

async function printBalance(accountAddress) {
  const balanceWei = await web3.eth.getBalance(accountAddress);
  const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
  console.log(`Balance of ${accountAddress}: ${balanceEther} Ether`);
}

const main = async (cb) => {
  try {
    const marketplace = await NftMarketplace.deployed();
    const csgoNFT = await CsgoNFT.deployed();

    console.log('List and Buy NFTs');
    const listingFee = await marketplace.LISTING_FEE();
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];

    const tokenId1 = 1; 
    await csgoNFT.mint("URI1", { from: accountAddress }); 
    await marketplace.listNft(csgoNFT.address, tokenId1, 1,"Title 1", "Description 1",{ value: listingFee });

    const tokenId2 = 2; 
    await csgoNFT.mint("URI2", { from: accountAddress }); 
    await marketplace.listNft(csgoNFT.address, tokenId2, 1, "Title 2", "Description 2", { value: listingFee });

    const tokenId3 = 3; 
    await csgoNFT.mint("URI3", { from: accountAddress }); 
    await marketplace.listNft(csgoNFT.address, tokenId3, 1, "Title 3", "Description 3", { value: listingFee });

    console.log(`Minted and listed NFTs with Token IDs: ${tokenId1}, ${tokenId2}, ${tokenId3}`);
    await logNftLists(marketplace);

    await marketplace.buyNft(csgoNFT.address, tokenId1, { value: 1 });
    await marketplace.buyNft(csgoNFT.address, tokenId2, { value: 1 });
    console.log('Bought 2 NFTs');
    await logNftLists(marketplace);
    await marketplace.listNft(csgoNFT.address, tokenId1, 1,"Title 1", "Description 1",{ value: listingFee });
        await logNftLists(marketplace);
    

  } catch (err) {
    console.log('Error: ', err);
  }
  cb();
};

module.exports = main;

