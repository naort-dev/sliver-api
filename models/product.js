const MongooseProduct = require('../models/mongoose/product');

class Product {
    /** 
     * @param {object} product
     * @return { promise }
     * */
    static create(product)
    {
        return MongooseProduct(product).save();
    }

    static getProducts()
    {
        let fields = {
            'product_name' : 1,
            'product_description' : 1,
            'build_fee' : 1,
            'of_build_month' : 1,
            'execute_fee' : 1,
            'of_execute_month' : 1,
            'plan_type' : 1,
            'date_created' : 1,
            '_id' : 0
        };
        
        return new Promise( (resolve,reject) => {
            let query = MongooseProduct.find()
                .select(fields);

            query.exec(function (err, result) {
                return err ? reject(err) : resolve({products : result});
            }); 
        });
    }
}

module.exports = Product;