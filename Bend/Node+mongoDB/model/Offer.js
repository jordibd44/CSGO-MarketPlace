const mongoose = require('mongoose')


const offerSchema = new mongoose.Schema(
    {
        idUserComprador: { type: String, required: true },
        idUserVendedor: {type: String, required: true},
        IdToken: {type: String, required: true},
        preu: {type: Number, required: true},
        estado: {type: String, required: true}
    },
    { collection: 'offer' }
)

const model = mongoose.model('offerSchema', offerSchema)

module.exports = model