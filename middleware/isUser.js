const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req,res,next) => {
    User.load({_id: req.query['access-token']})
        .then( (user) => {
            return user ? next() : res.status(401).send('Unauthorized');
        })
        .catch( () => {
            return res.status(404).send('User not found');
        });
};