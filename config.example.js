module.exports = {
    host : 'http://', //host
    db : process.env.db || '',   // mongodb localhost
    mailer : {
        accessKeyId: "", //AWS
        secretAccessKey: "", //AWS
        rateLimit: 5,  // do not send more than 5 messages in a second
        region : '' //region AWS
    },
    emailAddress : '', //AWS adress 
    stripe_key : ''  // stripe key
};