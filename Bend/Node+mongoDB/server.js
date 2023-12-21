const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors');
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
//BD
const mongoose = require('mongoose')
const User = require('./model/user')
const NFT = require('./model/NFT')
const Offer = require('./model/Offer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require("fs");
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//ganache
const Web3 = require('web3');
const CSGONFTContract = require('./build/csgoNFT.json');
const NftMarketplaceContract = require('./build/NftMarketplace.json');
const web3 = new Web3('http://localhost:8545');
let csgoNFTContract;
let nftMarketplaceContract;


let token;
var SesionUser;

mongoose.connect('mongodb://db:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
const app = express();
app.use(cors(corsOptions));
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password', async (req, res) => {
	const { newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	try{
		const user = await User.findOne({ username }).lean()
		if (!user) {
			return res.status(400).json({ status: 'error', error: 'Invalid username/password' })
		}

		if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
	
			token = jwt.sign({
				id: user._id,
				username: user.username
				},
				JWT_SECRET
			)
		SesionUser = user;
		console.log(user);
		return res.status(200).json({ status: 'ok', data: token })
		}
	}catch(error){
		console.error(error)
		return res.status(400).json({ status: 'error', error: 'Invalid username/password' })
	}
})

app.post('/api/register', async (req, res) => {
	console.log("entro")
	const { username, password: plainTextPassword, address } = req.body
        const count = await User.countDocuments({});
	if (count > 9) {
      		return res.status(400).json({ status: 'error', error: 'Número de registros de usuarios mayor que 9.' });
    	}
	if (!username || typeof username !== 'string') {
		return res.status(400).json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.status(400).json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.status(400).json({ status: 'error', error: 'Password too small. Should be atleast 6 characters'})
	}
	if (typeof address !== 'string'){
		return res.status(400).json({status: 'error',error:'Invalid addres format or not unique'})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password,
			address,
		})
		SesionUser = response;

		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
		    return res.status(400).json({ status: 'error', error: 'Username or address already in use.' });
	}
		throw error
	}
	res.status(200).json({ status: 'ok', data:token })
})

app.post('/api/createNFT', upload.single("imagen"), async (req, res) => {

	try{
		const numeroNFTs = await NFT.countDocuments();
		console.log(`coutn documnets ${numeroNFTs+1}`)
		const listingFee = await nftMarketplaceContract.methods.LISTING_FEE().call({ from: SesionUser.address });
		const price = web3.utils.toWei(req.body.price.toString(),'ether');
		await csgoNFTContract.methods.mint(numeroNFTs+1).send({ from: SesionUser.address, gas: 900000 });
		await nftMarketplaceContract.methods.listNft(
			csgoNFTContract.options.address,
			numeroNFTs+1,
			price,
			req.body.title,
			req.body.description,
		).send({ from: SesionUser.address, value: listingFee,gas: 900000 });

		  console.log(`NFT with token ${numeroNFTs+1} minted and listed successfully.`);
		  
		const obj = {
			IdToken: numeroNFTs+1,
			propietari: SesionUser.username,
			addressSeller: SesionUser.address,
			addressOwner: SesionUser.address,
			preu: req.body.price,
			titulo: req.body.title,
			listed: true,
			descripcion: req.body.description,
  			imagen: {
 			   	 contentType: req.body.image.type,
   				 data: req.body.image.data.toString("base64"),  			},
		};
		
		const response = NFT.create(obj)
		console.log('User created successfully: ', response)
		res.status(200).json({ status: 'ok' , data: obj})
	}catch(error){
		console.error(error);
		res.status(400).json({status: 'error'})
	}
})


app.get('/api/getbalance', async (req, res) => {
  try {
    const balance = await web3.eth.getBalance(SesionUser.address);
    const balanceString = web3.utils.fromWei(balance,'ether').toString();
    res.status(200).json({ balance: balanceString });
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el balance.' });
  }
});

app.get('/api/user-info', async (req, res) => {
	try {
		const user = jwt.verify(token, JWT_SECRET);
		const usuari = user.username;
		res.status(200).json({ usuari });
	} catch (error) {
		console.error(error);
		res.status(400).json({ status: 'error', error: 'Error en la recuperació de la informació de lusuari' });
	}
});

app.post('/api/getOffers', async (req, res) => {
	try{
		const user = jwt.verify(token, JWT_SECRET);
		const usuari = user.username;
		const list = await Offer.find({ idUserVendedor: usuari, estado: "Abierta" });
		if (list.length == 0) {
			return res.status(404).json({list});
		}
		return res.status(200).json({list});
	} catch (error) {
		//console.log(error)
		return res.status(400).json({ status: 'error', error: error })
		throw error
	}
});

app.post('/api/buyNFT', async (req, res) => {
	const oferta = req.body.data;
	console.log(oferta)
	try{
		const userComprador = await User.findOne({ username: oferta.idUserComprador }).lean()
		const userVendedor = await User.findOne({ username: oferta.idUserVendedor }).lean()
		const price = web3.utils.toWei(oferta.preu.toString(),'ether');
		await nftMarketplaceContract.methods.buyNft(csgoNFTContract.options.address, oferta.IdToken).send({ value: price, from: userComprador.address, gas:9000000 });
		await NFT.updateOne(
		   { "IdToken": oferta.IdToken  },      
		   { $set: { "propietari": oferta.idUserComprador,"addressSeller": userVendedor.address, "addressOwner":userComprador.address, "preu": oferta. preu, "listed": false  } })
		await Offer.updateMany(
		   { "IdToken": oferta.IdToken  },      
		   { $set: { "estado": "Cerrada"  } })
		return res.status(200).json({status: 'ok'})
	} catch (error) {
		//console.log(error)
		return res.status(400).json({ status: 'error', error: error })
		throw error
	}
});

app.post('/api/rechazarOferta', async (req, res) => {
	const id = req.body.data; 
	console.log(id)
	try{
		await Offer.updateOne(
		   { "_id": id },      
		   { $set: { estado: "Cerrada"  } })
		const offer = await Offer.findOne({ _id: id }).lean()
		if (offer.estado == "Cerrada"){
			return res.status(200).json({status: 'ok'})
		}else{
			return res.status(400).json({status: 'error'})
		}
	}catch (error) {
		//console.log(error)
		return res.status(400).json({ status: 'error', error: error })
		throw error
	}
});

app.post('/api/getPriceOffer', async (req, res) => {
	const { id } = req.body;
	try{
		const nft = await NFT.findOne( {IdToken: id} )
		return res.status(200).json({preu: nft.preu});
	} catch (error) {
		//console.log(error)
		return res.status(400).json({ status: 'error', error: error })
		throw error
	}
});


app.post('/api/listNFTs', async (req, res ) =>{
	try{
		const list = await NFT.find( {listed: true} )
		//console.log(list)
		return res.status(200).json({list})
	} catch (error) {
		//console.log(error)
		return res.status(400).json({ status: 'error', error: error })
		throw error
	}
})

app.post('/api/listALLNFTs', async (req, res ) =>{
	try{
		const list = await NFT.find({})
		//console.log(list)
		return res.status(200).json({list})
	} catch (error) {
		//console.log(error)
		return res.status(400).json({ status: 'error', error: error })
		throw error
	}
})

app.post('/api/newOffer', async (req, res) => {
	const { idUserVendedor, IdToken, preu, preuOferta } = req.body
	try{
		const user = jwt.verify(token, JWT_SECRET);
		const usuari = user.username;
		if (preuOferta < preu) return res.status(400).json({ status: 'error', error: "El precio tiene que ser mas alto o igual a su valor" })
		console.log(SesionUser._id)
		const obj = {
			idUserComprador: usuari,
			idUserVendedor: idUserVendedor,
			IdToken: IdToken,
			preu: preuOferta,
			estado: "Abierta"
		}

		const response = await Offer.create(obj)
		console.log('User created successfully: ', response)
	} catch (error) {
		console.log(error)
		return res.status(400).json({ status: 'error', error: error })
	}
	return res.status(200).json({ status: 'ok' })
})

app.post('/api/editVendible', async (req, res) => {
	const { id, listed } = req.body; 
	try {
		const valorListed = !listed;
		const item = await NFT.updateOne(
			{ IdToken: id },
			{ $set: { listed: valorListed } }
		);
		if (!item) {
			console.log('Item no trobat');
			return res.status(404).json({ status: 'error', error: 'Item not found' });
		}else{
			if (valorListed){
			    await nftMarketplaceContract.methods.ReListNFT(id).send({ from: SesionUser.address, gas: 900000 });
   				console.log('Relist Ok')
			}else{
				await nftMarketplaceContract.methods.unListNFT(id).send({ from: SesionUser.address, gas: 900000 });
    			console.log('unlist exitosa.');
			}
		}
		return res.status(200).json({ status: 'ok' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
	}
});

app.post('/api/newPrice', async (req, res) => {
	const { id, price } = req.body; 
	try {
		await nftMarketplaceContract.methods.ChangePrice(id,web3.utils.toWei(price,'ether')).send({ from: SesionUser.address, gas: 90000 });
		const item = await NFT.updateOne(
			{ IdToken: id },
			{ $set: { preu: price } }
		);

		if (!item) {
			return res.status(404).json({ status: 'error', error: 'Item not found' });
		}
		return res.status(200).json({ status: 'ok' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
	}
});

var dir = path.join(__dirname, '');

var mime = {
	html: 'text/html',
	txt: 'text/plain',
	css: 'text/css',
	gif: 'image/gif',
	jpg: 'image/jpeg',
	png: 'image/png',
	svg: 'image/svg+xml',
	js: 'application/javascript'
};

app.get('*', function (req, res) {
	var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
	if (file.indexOf(dir + path.sep) !== 0) {
		return res.status(403).end('Forbidden');
	}
	var type = mime[path.extname(file).slice(1)] || 'text/plain';
	var s = fs.createReadStream(file);
	s.on('open', function () {
		res.set('Content-Type', type);
		s.pipe(res);
	});
	s.on('error', function () {
		res.set('Content-Type', 'text/plain');
		res.status(404).end('Not found');
	});
});


app.listen(9999, async () => {
	await web3.eth.net.getId()
	    .then(networkId => {
		csgoNFTContract = new web3.eth.Contract(CSGONFTContract.abi, CSGONFTContract.networks[networkId].address);
		nftMarketplaceContract = new web3.eth.Contract(NftMarketplaceContract.abi, NftMarketplaceContract.networks[networkId].address);
	    })
	    .catch(error => {
		console.log('Error al obtener datos:', error);});
	console.log('Server up at 9999');
});
