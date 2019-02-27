const mongoose = require('mongoose');


const schema = new mongoose.Schema({ 

    UserID:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topic:             { type: String, default: "" }, 
    agenda:            { type: String, default: "" },
    meeting_date:      { type: String, default: "" },
    meeting_start_time:{ type: String, default: "" },
    meeting_duration:  { type: String, default: "" },
    time_zone:         { type: String, default: "" }

},{ 
    timestamps: true 
});

module.exports = mongoose.model('Meeting', schema);