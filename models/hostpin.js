const mongoose = require('mongoose');


const schema = new mongoose.Schema({ 

    hostPin: { type: Number, default: "1000" }

});

module.exports = mongoose.model('hostPin', schema);