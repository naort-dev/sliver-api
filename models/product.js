const MongooseProduct = require('../models/mongoose/product');

class Product {

    /**
     * Create product
     *
     * @param {object} product
     * @return { promise }
     * */
    static create(product) {
        return MongooseProduct(product).save();
    }

    /**
     * Get all list products
     *
     * @return {Promise} result
     * */
    static getProducts() {
        let fields = {
            'productName': 1,
            'productDescription': 1,
            'costProduct': 1,
            'billingFrequency': 1,
            'expertHours': 1,
            'amountFirstPayment': 1,
            'createdAt': 1,
            '_id': 1
        };

        return new Promise((resolve, reject) => {
            let query = MongooseProduct.find()
                .select(fields);

            query.exec(function (err, result) {
                return err ? reject(err) : resolve(result);
            });
        });
    }

    /**
     * Get product by ID
     * 
     * @param {string} id
     * */
    static getProduct(id) {
        return new Promise((resolve, reject) => {
            MongooseProduct.findOne({_id: id})
                .then((data) => {
                    if (!data) reject(new AuthError('Item not found to DB', 'NOT_FOUND'));
                    return resolve({product : data});
                })
                .catch(reject);
        });
    }

    /**
     * Update product
     *
     * @param {Object} product
     * */
    static updateProduct(product) {
        return new Promise((resolve,reject) => {
            MongooseProduct.findByIdAndUpdate(product._id, product, (err,res) => {
                return err ? reject(err) : resolve(res);
            });
        });
    };

    /**
     * Delete product by id
     * 
     * @param  {string} id
     * */
    static deleteProduct(id) {
        return new Promise((resolve,reject) => {
            MongooseProduct.remove({_id : id}, (err,response) => {
                return err ? reject(err) : resolve(response.result);
            });
        });
    }

    /**
     * Get one bild type oneTime and one build type installments
     *
     **/
    static getBuilds() {
        return new Promise((resolve, reject) => {
            let result = [];
            let builds = {};
            MongooseProduct.findOne({'buildType.id' : 1,status: true,typeProduct:false})
                .then((response) => {
                    builds.installments = response;
                    return MongooseProduct.findOne({'buildType.id' : 2,status: true,typeProduct:false});
                })
                .then((response) => {
                    builds.oneTime = response;
                    result.push(builds);
                    resolve(result);
                })
                .catch((err) => {
                    return reject(err);
                });

        });
    }
}

module.exports = Product;