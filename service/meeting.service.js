const Meeting = require('../models/meeting');

module.exports.createMeeting = (params) => {
    return new Meeting(params).save();
};

module.exports.getMeeting = (query) => {
    return Meeting.findOne(query).lean().exec();
};

module.exports.getAllMeeting = (query) => {
    return Meeting.find(query).populate('UserID').lean().exec();
    // return Meeting.find(query).lean().exec();

};

module.exports.getMeetings = () => {
    return Meeting.findOne({}, {'userID': 1, '_id': 0 }, { sort: { 'createdAt' : -1 }}).lean().exec();
};

module.exports.updateMeeting = (query, data) => {
    return Meeting.updateOne(query, data).exec();
};