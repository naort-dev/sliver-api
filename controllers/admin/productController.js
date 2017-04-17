const Product = require('../../models/product');
const mongoose = require('mongoose');
const mProduct = mongoose.model('Product');

class ProductController {

    static create(req)
    {
        return Product.create(req.body);
    }
    
    static getProducts()
    {
        return mProduct.list();
    }

    static getProduct(req)
    {
        return Product.getProduct(req.params.id);
    }

    static updateProduct(req)
    {
        return Product.updateProduct(req.query);
    }
    
    static deleteProduct(req) {
        return Product.deleteProduct(req.params.id);
    }
    
    static getPlans() {
        let options = {
            limit : 6,
            criteria : {
                status:Product.ACTIVE,
                typeProduct:Product.TYPE_PLAN
            }            
        };
        
        return mProduct.list(options);
    }
    
    static getBuilds() {
        return Product.getBuilds();
    }

}

module.exports = ProductController;