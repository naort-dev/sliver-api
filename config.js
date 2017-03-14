module.exports = {
     db : process.env.db || 'mongodb://localhost:27017/slap',
     mailer : {
          service: 'us-west-2.amazonses.com',
          auth: {
               user: 'ses-smtp-user.20140616-114848-at-144447329755',
               pass: 'GWl+7d6M6H4faGF5jiSnM5kY4eokh30DxnDD/GDZNWY='
          }
     }
};