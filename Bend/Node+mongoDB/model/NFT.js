const mongoose = require('mongoose')

const { randomUUID } = require('crypto');

const NFTSchema = new mongoose.Schema(
    {
        IdToken: { type: String, required: true, unique: true },
        propietari: { type: String, required: true },
        addressSeller: {type: String, required: true},
        addressOwner: {type: String, required: true},
        preu: {type: Number},
        titulo: {type: String},
        listed: {type: Boolean, required: true},
        descripcion: {type: String},
        imagen: {contentType: String, data: String}
    },
    { collection: 'NFTs' }
)

const model = mongoose.model('NFTSchema', NFTSchema)

module.exports = model