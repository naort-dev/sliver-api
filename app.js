let express = require('express');
let http = require('http');
let router = require('./router/index');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

let app = express();

app.use(bodyParser.json());
app.use(expressValidator());

app.use(router);

http.createServer(app).listen(8100, () => {
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
    res.render('error');
});