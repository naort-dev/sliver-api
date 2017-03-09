let mongoose = require('mongoose');
let config = require('../config.js');

mongoose.connect(config.db);

module.exports = mongoose;
