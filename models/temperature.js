const mongoose = require('mongoose')

const temperatureSchema = new mongoose.Schema({
    _id: String,
    temperature: Number,
    pressure: Number,
    specific_volume_liquid: Number,
    specific_volume_vapor: Number,
    internal_energy_liquid: Number,
    internal_energy_evap: Number,
    internal_energy_vapor: Number,
    enthalphy_liquid: Number,
    enthalphy_evap: Number,
    enthalphy_vapor: Number,
    entropy_liquid: Number,
    entropy_evap: Number,
    entropy_vapor: Number,
},
{ collection: 'temperature' }
)

module.exports = mongoose.model('temperature', temperatureSchema)