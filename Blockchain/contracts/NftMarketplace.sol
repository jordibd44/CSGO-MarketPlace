// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NftMarketplace is ReentrancyGuard {
	//contador para llevar la cuenta de los NFTs 
	uint public _nftCount = 0;
	//precio minimo que se le puede poner al NFT, para cubrir gastos blockchain
    uint256 public LISTING_FEE = 0.0001 ether;
    //persona que hará la transaccion
    address payable private _marketOwner;

    // Mapping que asocia un ID de NFT con su estructura NFT
    mapping(uint256 => NFT) private _idToNFT;

	//Estructura que tendrá nuestro NFT
    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
        string title;
        string description;
    }
	
	event result(bool success);
	
	//contructora
	constructor() {
  		//assignamos a la varible los datos del que hace la transaccion
  		_marketOwner = payable(msg.sender);
  	}
  	
  // Añadimos el NFT a la lista de vendibles
  function listNft(address _nftContract, uint256 _tokenId, uint256 _price,string memory _title, string memory _description) public payable nonReentrant {
	  	//El precio minimo del NFT debe de ser mayor a 1
		require(_price > 0, "Price must be at least 1 wei");
		//cada transaccion tiene un coste para la blockchain, con esto nos aseguramos de no perder dinero, ya que lo pagan los usuarios
		require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

		//asignamos el propietario del NFT al que hace la transaccion
		IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
		//Quitamos el dinero del coste al usuario que lista el NFT
		_marketOwner.transfer(LISTING_FEE);
		//incrementamos el contador de listed
		_nftCount++;
			
		_idToNFT[_tokenId] = NFT(
		_nftContract,
		_tokenId, 
		payable(msg.sender),
		payable(msg.sender),
		_price,
		true,
		_title,
		_description
		);

		emit result(true);
    }


	//Comprar NFT
    function buyNft(address _nftContract, uint256 _tokenId) public payable nonReentrant {
    	//nos guardamos el NFT con el id del token
        NFT storage nftItem = _idToNFT[_tokenId];
        //Comprovamos que el NFT que se quiere comprar este disponible para comprar
        require(nftItem.listed, "NFT is not listed for sale");
        //comprovamos que el precio que ofrece es mayor o igual al ofrecido
        require(msg.value >= nftItem.price, "Not enough ether to cover the price");

		//nos guardamos el comprador
        address payable buyer = payable(msg.sender);
        //transferimos el precio del NFT al vendedor
        payable(nftItem.seller).transfer(msg.value);
        //Quitamos el precio de nFT al comprador
        IERC721(_nftContract).transferFrom(address(this), buyer, nftItem.tokenId);
        //Cambiamos el propietario del NFT
        nftItem.owner = buyer;
        //Ponemos el nft como no vendible
        nftItem.listed = false;
		
        //devolvemos el evento de NFTSold con informacion sobre la transacción
		emit result(true);
    }

	//funcion para hacer que un nft no sea vendible
	function unListNFT(uint256 _tokenId) public payable nonReentrant{
	    //nos guardamos el NFT con el id del token
        NFT storage nftItem = _idToNFT[_tokenId];
        //Comprovamos que el NFT que se quiere comprar este disponible para comprar
        require(nftItem.listed, "NFT is not listed for sale");
        nftItem.listed = false;
		emit result(true);
	}
	
	//funcion para reelistar NFT
	function ReListNFT(uint256 _tokenId) public payable nonReentrant{
		 //nos guardamos el NFT con el id del token
		NFT storage nftItem = _idToNFT[_tokenId];
		//Comprovamos que el NFT que se quiere comprar este disponible para comprar
		require(!nftItem.listed, "NFT is listed for sale");
		nftItem.listed = true;
		emit result(true);
	}
	
		//funcion para reelistar NFT
	function ChangePrice(uint256 _tokenId, uint256 _price) public payable nonReentrant{
		 //nos guardamos el NFT con el id del token
		NFT storage nftItem = _idToNFT[_tokenId];
		nftItem.price = _price;
		emit result(true);
	}
	
	//Listamos todos los NFTs que son vendibles
    function getListedNfts() public view returns (NFT[] memory) {
        //Variable con lista de NFTs vendibles
        uint256 listedNftsCount = 0;
		
		//Bucle para calcular el numero de NFTs vendibles
        for (uint i = 1; i <= _nftCount; i++) {
            if (_idToNFT[i].listed) {
                listedNftsCount++;
            }
        }
		
		//Creamo un vector de NFTs dle tamaño listedNFTCount que luego devolveremos
        NFT[] memory listedNfts = new NFT[](listedNftsCount);
        //Indice 0 del vector de NFTs
        uint nftsIndex = 0;
		
		//Bucle donde recorremos el vector de NFTs buscando los que son vendibles y añadiendolos al vector listedNfts
        for (uint i = 1; i <= _nftCount; i++) {
            if (_idToNFT[i].listed) {
                listedNfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
		//Devolvemos el vector de NFTs vendibles
        return listedNfts;
    }

	//Obtenemos todos los NFTs en propiedad del usuario que llama la funcion
    function getMyNfts() public view returns (NFT[] memory) {
        //Varible numero NFTs propios
        uint256 myNftCount = 0;

		//Funcion que recorre todos los NFTs comprobando el owner y calcula el total
        for (uint i = 1; i <= _nftCount; i++) {
            if (_idToNFT[i].owner == msg.sender) {
                myNftCount++;
            }
        }
		//creamos vector que devolveremos
        NFT[] memory myNfts = new NFT[](myNftCount);
        uint nftsIndex = 0;
		//BUcle qeu recorre vector de NFTs y añade los del propiertario
        for (uint i = 1; i <= _nftCount; i++) {
            if (_idToNFT[i].owner == msg.sender) {
                myNfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
		//Vector que devuelve los NFTs del propiertario
        return myNfts;
    }
}


