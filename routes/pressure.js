const express = require('express')
const router = express.Router()
const pressureModel = require('../models/pressure')
const { Compute } = require('../features/Interpolation')


router.get('/pressure_details', async (req, res) => {
    const input_pressure = req.query.pressure
    const state = req.query.state
    try{
        let pressure_details = [];
        pressure_details = await pressureModel.find({pressure: input_pressure})
        
        if(pressure_details.length === 0){
            const row1 = await getGreaterThanRow1PressureDetails(input_pressure)
            const row2 = await getLestThanRow2PressureDetails(input_pressure)

            if(state === "liquid"){
                pressure_details = getInterpolationLiquidDetails(row1, row2, input_pressure);
            }
            else{
                pressure_details = getInterpolationVaporDetails(row1, row2, input_pressure);
            }
            
            res.send(pressure_details)
        }
        else{
            if(state === "liquid"){
                pressure_details = getLiquidDetails(JSON.parse(JSON.stringify(pressure_details[0])));
            }
            else{
                pressure_details = getVaporDetails(JSON.parse(JSON.stringify(pressure_details[0])));
            }
            
            res.send(pressure_details)
        }
    } catch(err) {
        res.status(500).json( {message: err.message})
    }
})

const getGreaterThanRow1PressureDetails = async (input_pressure) => {
    const pressure_details = await pressureModel.find({pressure: {$gt: input_pressure} }).sort({pressure: 1}).limit(1)
    return pressure_details[0];
}

const getLestThanRow2PressureDetails = async (input_pressure) => {
    const pressure_details = await pressureModel.find({pressure: {$lt: input_pressure} }).sort({pressure: -1}).limit(1)
    return pressure_details[0];
}

const getLiquidDetails = (pressure_details) => {
    const keysWithLiquid = Object.keys(pressure_details).filter(key => !key.toLowerCase().includes("vapor") && key !== "_id");
    return keysWithLiquid.reduce((result, key) => {
      result[0][key] = pressure_details[key];
      return result;
    }, [{}]);
}

const getVaporDetails = (pressure_details) => {
    const keysWithVapor = Object.keys(pressure_details).filter(key => !key.toLowerCase().includes("liquid") && key !== "_id");
    return keysWithVapor.reduce((result, key) => {
      result[0][key] = pressure_details[key];
      return result;
    }, [{}]);
}

const getInterpolationLiquidDetails = (row1, row2, input_pressure) => {
    const pressure = +input_pressure;
    const temperature = Compute(row1?.temperature, row2?.temperature, input_pressure, row1?.pressure, row2?.pressure);
    const specific_volume_liquid = Compute(row1?.specific_volume_liquid, row2?.specific_volume_liquid, input_pressure, row1?.pressure, row2?.pressure);
    const internal_energy_liquid = Compute(row1?.internal_energy_liquid, row2?.internal_energy_liquid, input_pressure, row1?.pressure, row2?.pressure);
    const internal_energy_evap = Compute(row1?.internal_energy_evap, row2?.internal_energy_evap, input_pressure, row1?.pressure, row2?.pressure);
    const enthalphy_liquid = Compute(row1?.enthalphy_liquid, row2?.enthalphy_liquid, input_pressure, row1?.pressure, row2?.pressure);
    const enthalphy_evap = Compute(row1?.enthalphy_evap, row2?.enthalphy_evap, input_pressure, row1?.pressure, row2?.pressure);
    const entropy_liquid = Compute(row1?.entropy_liquid, row2?.entropy_liquid, input_pressure, row1?.pressure, row2?.pressure);
    const entropy_evap = Compute(row1?.entropy_evap, row2?.entropy_evap, input_pressure, row1?.pressure, row2?.pressure);
    const _id = row1?._id;

    let pressure_details = [{
        // _id,
        pressure,
        temperature,
        specific_volume_liquid,
        internal_energy_liquid,
        internal_energy_evap,
        enthalphy_liquid,
        enthalphy_evap,
        entropy_liquid,
        entropy_evap,
    }]

    return pressure_details;
}

const getInterpolationVaporDetails = (row1, row2, input_pressure) => {
    const pressure = +input_pressure;
    const temperature = Compute(row1?.temperature, row2?.temperature, input_pressure, row1?.pressure, row2?.pressure);
    const specific_volume_vapor = Compute(row1?.specific_volume_vapor, row2?.specific_volume_vapor, input_pressure, row1?.pressure, row2?.pressure);
    const internal_energy_vapor = Compute(row1?.internal_energy_vapor, row2?.internal_energy_vapor, input_pressure, row1?.pressure, row2?.pressure);
    const internal_energy_evap = Compute(row1?.internal_energy_evap, row2?.internal_energy_evap, input_pressure, row1?.pressure, row2?.pressure);
    const enthalphy_vapor = Compute(row1?.enthalphy_vapor, row2?.enthalphy_vapor, input_pressure, row1?.pressure, row2?.pressure);
    const enthalphy_evap = Compute(row1?.enthalphy_evap, row2?.enthalphy_evap, input_pressure, row1?.pressure, row2?.pressure);
    const entropy_vapor = Compute(row1?.entropy_vapor, row2?.entropy_vapor, input_pressure, row1?.pressure, row2?.pressure);
    const entropy_evap = Compute(row1?.entropy_evap, row2?.entropy_evap, input_pressure, row1?.pressure, row2?.pressure);
    const _id = row1?._id;

    let pressure_details = [{
        // _id,
        pressure,
        temperature,
        specific_volume_vapor,
        internal_energy_vapor,
        internal_energy_evap,
        enthalphy_vapor,
        enthalphy_evap,
        entropy_vapor,
        entropy_evap,
    }]

    return pressure_details;
}


module.exports = router