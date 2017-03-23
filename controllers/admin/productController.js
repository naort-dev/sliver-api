const Product = require('../../models/product');

class ProductController {

    static create(req)
    {
        return Product.create(req.body);
    }
    
    static getProducts()
    {
        return Product.getProducts();
    }

}

module.exports = ProductController;