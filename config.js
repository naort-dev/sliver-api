module.exports = {
     host : 'http://35.167.122.18/',
     db : process.env.db || 'mongodb://localhost:27017/slap',
     mailer : {
          accessKeyId: "AKIAIA62CYCWJTLMM6JQ",
          secretAccessKey: "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",
          rateLimit: 5,  // do not send more than 5 messages in a second
          region : 'us-west-2'
     },
     emailAddress : 'admin@silverlininglimited.com'
};