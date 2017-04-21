const User = require('../models/user');

module.exports = (req,res,next) => {
    User.authToken(req.query['access-token'])
        .then( (user) => {
            user.isAdmin === 1 ? next() : res.status(403).send('Forbidden');
        })
        .catch( () => {
            res.status(404).send('User not found');
        });
};