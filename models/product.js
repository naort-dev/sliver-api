const MongooseProduct = require('../models/mongoose/product');

class Product {

    /** @param {object} product*/
    static create(product)
    {
        return new MongooseProduct(product).save();
    }
}

module.exports = Product;