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

    static getProduct(req)
    {
        return Product.getProduct(req.params.id);
    }

    static updateProduct(req)
    {
        return Product.getProduct(req.params.id);
    }

}

module.exports = ProductController;