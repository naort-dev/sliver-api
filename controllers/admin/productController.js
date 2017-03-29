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
        let product = req.query;
        product.product_type.forEach( function(item,i) {
            product.product_type[i] = JSON.parse(item);
        });
        return Product.updateProduct(product);
    }
    
    static deleteProduct(req) {
        return Product.deleteProduct(req.params.id);
    }

}

module.exports = ProductController;