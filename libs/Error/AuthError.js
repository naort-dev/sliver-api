'use strict';
const util = require('util');

class AuthError {

    constructor(status,message) {
        this.status = status;
        this.message = message;
    }
}

util.inherits(AuthError, Error);

module.exports = AuthError;