// server.js


var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var fs = require('fs');
var multer  = require('multer');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/ecart", {native_parser:true});
var port = process.env.PORT || 3000; // set our port
var adminAuthenticationKey = '876##2!bf$$23jht@@@RD';

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(multer({ dest: __dirname +'/public/temp_upload/'}));



app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

//Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.fs=fs;
    req.mongo = mongo;
    req.adminKey = adminAuthenticationKey;
    next();
});

// routes ==================================================
require('./app/routes')(app); // configure our routes

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start app ===============================================
app.listen(port);										// startup our app at http://localhost:8080
console.log('Application running on port: ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
