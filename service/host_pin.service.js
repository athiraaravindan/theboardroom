const hostPin = require('../models/hostpin');

module.exports.createHost = (params) => {
    return new hostPin(params).save();
};

module.exports.getHost = () => {
    return hostPin.findOne().lean().exec();
};

module.exports.updateHost = ( data) => {
    return hostPin.updateOne( data).exec();
};