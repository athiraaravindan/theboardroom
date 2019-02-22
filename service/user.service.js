const User = require('../models/user');

module.exports.createUser = (params) => {
    return new User(params).save();
};

module.exports.getUser = (query) => {
    return User.findOne(query).lean().exec();
};

module.exports.getUsers = (query) => {
    return User.find(query).lean().exec();
};

module.exports.getAllUsers = () => {
    return User.findOne({}, {'userID': 1, '_id': 0 }, { sort: { 'createdAt' : -1 }}).lean().exec();
};

module.exports.updateUser = (query, data) => {
    return User.updateOne(query, data).exec();
};