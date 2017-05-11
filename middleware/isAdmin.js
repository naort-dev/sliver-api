module.exports = (req,res,next) => {
    if(req.decoded) {
        return req.decoded._doc.admin == 1 ? next() : res.status(403).send('Forbidden');
    } else {
        return res.status(404).send('User not found');
    }
    

    // User.load({_id: req.query['access-token']})
    //     .then( (user) => {
    //         return user.isAdmin() ? next() : res.status(403).send('Forbidden');
    //     })
    //     .catch( () => {
    //         return res.status(404).send('User not found');
    //     });
};