const express = require('express')
const router = express.Router()
const temperatureModel = require('../models/temperature')
const { Compute } = require('../features/Interpolation')


router.get('/temperature_details', async (req, res) => {
    const input_temperature = req.query.temperature
    const state = req.query.state
    try{
        let temperature_details = [];
        temperature_details = await temperatureModel.find({temperature: input_temperature})
        
        if(temperature_details.length === 0){
            const row1 = await getGreaterThanRow1temperatureDetails(input_temperature)
            const row2 = await getLestThanRow2temperatureDetails(input_temperature)

            if(state === "liquid"){
                temperature_details = getInterpolationLiquidDetails(row1, row2, input_temperature);
            }
            else{
                temperature_details = getInterpolationVaporDetails(row1, row2, input_temperature);
            }
            
            res.send(temperature_details)
        }
        else{
            if(state === "liquid"){
                temperature_details = getLiquidDetails(JSON.parse(JSON.stringify(temperature_details[0])));
            }
            else{
                temperature_details = getVaporDetails(JSON.parse(JSON.stringify(temperature_details[0])));
            }
            
            res.send(temperature_details)
        }
    } catch(err) {
        res.status(500).json( {message: err.message})
    }
})

const getGreaterThanRow1temperatureDetails = async (input_temperature) => {
    const temperature_details = await temperatureModel.find({temperature: {$gt: input_temperature} }).sort({temperature: 1}).limit(1)
    return temperature_details[0];
}

const getLestThanRow2temperatureDetails = async (input_temperature) => {
    const temperature_details = await temperatureModel.find({temperature: {$lt: input_temperature} }).sort({temperature: -1}).limit(1)
    return temperature_details[0];
}

const getLiquidDetails = (temperature_details) => {
    const keysWithLiquid = Object.keys(temperature_details).filter(key => !key.toLowerCase().includes("vapor") && key !== "_id");
    return keysWithLiquid.reduce((result, key) => {
      result[0][key] = temperature_details[key];
      return result;
    }, [{}]);
}

const getVaporDetails = (temperature_details) => {
    const keysWithVapor = Object.keys(temperature_details).filter(key => !key.toLowerCase().includes("liquid") && key !== "_id");
    return keysWithVapor.reduce((result, key) => {
      result[0][key] = temperature_details[key];
      return result;
    }, [{}]);
}

const getInterpolationLiquidDetails = (row1, row2, input_temperature) => {
    const temperature = +input_temperature;
    const pressure = Compute(row1?.pressure, row2?.pressure, input_temperature, row1?.temperature, row2?.temperature);
    const specific_volume_liquid = Compute(row1?.specific_volume_liquid, row2?.specific_volume_liquid, input_temperature, row1?.temperature, row2?.temperature);
    const internal_energy_liquid = Compute(row1?.internal_energy_liquid, row2?.internal_energy_liquid, input_temperature, row1?.temperature, row2?.temperature);
    const internal_energy_evap = Compute(row1?.internal_energy_evap, row2?.internal_energy_evap, input_temperature, row1?.temperature, row2?.temperature);
    const enthalphy_liquid = Compute(row1?.enthalphy_liquid, row2?.enthalphy_liquid, input_temperature, row1?.temperature, row2?.temperature);
    const enthalphy_evap = Compute(row1?.enthalphy_evap, row2?.enthalphy_evap, input_temperature, row1?.temperature, row2?.temperature);
    const entropy_liquid = Compute(row1?.entropy_liquid, row2?.entropy_liquid, input_temperature, row1?.temperature, row2?.temperature);
    const entropy_evap = Compute(row1?.entropy_evap, row2?.entropy_evap, input_temperature, row1?.temperature, row2?.temperature);
    const _id = row1?._id;

    let temperature_details = [{
        // _id,
        temperature,
        pressure,
        specific_volume_liquid,
        internal_energy_liquid,
        internal_energy_evap,
        enthalphy_liquid,
        enthalphy_evap,
        entropy_liquid,
        entropy_evap,
    }]

    return temperature_details;
}

const getInterpolationVaporDetails = (row1, row2, input_temperature) => {
    const temperature = +input_temperature;
    const pressure = Compute(row1?.pressure, row2?.pressure, input_temperature, row1?.temperature, row2?.temperature);
    const specific_volume_vapor = Compute(row1?.specific_volume_vapor, row2?.specific_volume_vapor, input_temperature, row1?.temperature, row2?.temperature);
    const internal_energy_vapor = Compute(row1?.internal_energy_vapor, row2?.internal_energy_vapor, input_temperature, row1?.temperature, row2?.temperature);
    const internal_energy_evap = Compute(row1?.internal_energy_evap, row2?.internal_energy_evap, input_temperature, row1?.temperature, row2?.temperature);
    const enthalphy_vapor = Compute(row1?.enthalphy_vapor, row2?.enthalphy_vapor, input_temperature, row1?.temperature, row2?.temperature);
    const enthalphy_evap = Compute(row1?.enthalphy_evap, row2?.enthalphy_evap, input_temperature, row1?.temperature, row2?.temperature);
    const entropy_vapor = Compute(row1?.entropy_vapor, row2?.entropy_vapor, input_temperature, row1?.temperature, row2?.temperature);
    const entropy_evap = Compute(row1?.entropy_evap, row2?.entropy_evap, input_temperature, row1?.temperature, row2?.temperature);
    const _id = row1?._id;

    let temperature_details = [{
        // _id,
        temperature,
        pressure,
        specific_volume_vapor,
        internal_energy_vapor,
        internal_energy_evap,
        enthalphy_vapor,
        enthalphy_evap,
        entropy_vapor,
        entropy_evap,
    }]

    return temperature_details;
}


module.exports = router