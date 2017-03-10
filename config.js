module.exports = {
     db : process.env.db || 'mongodb://localhost:27017/slap',
     mailer : {
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
               user: "36570b6609eca8",
               pass: "03c748634d6ff1"
          }
     }
};