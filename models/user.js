const mongoose = require('mongoose');


const schema = new mongoose.Schema({ 

    name: { type: String, default: "" }, 
    socialID: { type: String, default: "" }, 
    profilePictureUrl: { type: String, default: "" }
},{ 
    timestamps: true 
});

module.exports = mongoose.model('User', schema);