const Product = require('../models/product');

class ProductController {

    static create(req)
    {
        return Product.create(req.body);
    }

}

module.exports = ProductController;