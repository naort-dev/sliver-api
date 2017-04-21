const MongooseProduct = require('../models/mongoose/product');
const CustomError = require('../libs/error/CustomError');

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
     * Get product by ID
     * 
     * @param {string} id
     * */
    static getProduct(id) {
        return new Promise((resolve, reject) => {
            MongooseProduct.findOne({_id: id})
                .then((data) => {
                    if (!data) reject(new CustomError('Item not found to DB', 'NOT_FOUND'));
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
            // let builds = {};

            MongooseProduct.findOne({
                buildType : this.BUILD_ONETIME,
                status: this.ACTIVE,
                typeProduct:this.TYPE_BUILD})
            .then((response) => {
                if(response) {
                    result.push(response);                    
                }
                
                return MongooseProduct.findOne({
                    buildType : this.BUILD_INSTALLMENTS,
                    status: this.ACTIVE,
                    typeProduct:this.TYPE_BUILD
                });
            })
            .then((response) => {
                if(response) {
                    result.push(response);
                }
                // builds.oneTime = response;
                resolve(result);
            })
            .catch((err) => {
                return reject(err);
            });

        });
    }
}

Product.TYPE_PLAN = 1;
Product.TYPE_BUILD = 2;


Product.ACTIVE = 1;
Product.INACTIVE = 0;

Product.BUILD_INSTALLMENTS = 1;
Product.BUILD_ONETIME = 2;

module.exports = Product;