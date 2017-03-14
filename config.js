module.exports = {
     db : process.env.db || 'mongodb://localhost:27017/slap',
     mailer : {
          accessKeyId: "AKIAIA62CYCWJTLMM6JQ",
          secretAccessKey: "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",
          rateLimit: 5 // do not send more than 5 messages in a second
     }
};