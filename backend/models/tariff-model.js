
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tariff = new Schema(
    {
        providerId: { type: Number, required: true },
        tariffId: { type: Number, required: true },
        name: { type: String, required: true },
        price: {
            value: { type: Number, required: true },
            color: { type: String},
        },
        internet: {
            value: { type: Number, required: true },
            color: { type: String},
        },
        tv_channels: {
            value: { type: Number, required: true },
            color: { type: String },
        },
        tv_channels_hd: {
            value: { type: Number, required: true },
            color: { type: String},
        },
        fields: { type: Number},

    },
    { timestamps: true },
)

module.exports = mongoose.model('tariffs', Tariff)