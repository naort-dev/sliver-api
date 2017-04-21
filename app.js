let express = require('express');
let http = require('http');

let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

const fs = require('fs');
const join = require('path').join;
const models = join(__dirname, 'models/mongoose');
const port = process.env.PORT || 8000;

let app = express();

app.use(bodyParser.json());
app.use(expressValidator({
    customValidators: {
        isArray: function (value) {
            return Array.isArray(value);
        }
    }
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// Bootstrap models
fs.readdirSync(models)
    .filter((file) => ~file.search(/^[^\.].*\.js$/))
    .forEach((file) => {
        // console.log(join(models, file));
        require(join(models, file));
    });

let router = require('./router/index');
app.use(router);

http.createServer(app).listen(port, () => {
    console.log('Run server');
});

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
});