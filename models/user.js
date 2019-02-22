const mongoose = require('mongoose');


const schema = new mongoose.Schema({ 

    name:               { type: String, default: "" }, 
    socialID:           { type: String, default: "" }, 
    profilePictureUrl:  { type: String, default: "" },
    emailAddress:       { type: String, default: "" },
    password:           { type: String, default: "" },
    phone:              { type: Number, default: "" },
    company:            { type: String, default: "" },
    company_size:       { type: String, default: "" },
    country:            { type: String, default: "" },
    time_zone:          { type: String, default: "" },
    login_type:         { type: String, default: "ordinary" }

},{ 
    timestamps: true 
});

module.exports = mongoose.model('User', schema);