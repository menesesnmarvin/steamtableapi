const mongoose = require('mongoose')

const pressureSchema = new mongoose.Schema({
    _id: String,
    pressure: Number,
    temperature: Number,
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
{ collection: 'pressure' }
)

module.exports = mongoose.model('pressure', pressureSchema)