// server.js
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary');
var MSON = require('mongoson');

var path = require('path');
var fs = require('fs');
var multer  = require('multer');
var mongo = require('mongoskin');
var serverOptions = {
	     'auto_reconnect': true,
	     'poolSize': 5,
	     'native_parser':true
};

var knox = require('knox').createClient({
    key: process.env.S3_Key,
    secret: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET
});

//var db = mongo.db("mongodb://localhost:27017/ecart", {native_parser:true});
var mongoLabStr = 'mongodb://'+process.env.MONGO_LAB_USERNAME+':'+process.env.MONGO_LAB_PASSWORD+'@ds036698.mongolab.com:36698/ecart';
var db = mongo.db(mongoLabStr,serverOptions);
var port = process.env.PORT || 3000; // set our port
var adminAuthenticationKey = '876##2!bf$$23jht@@@RD';
var ownerEmail = process.env.USER_EMAIL

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

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

cloudinary.config({ 
	  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
	  api_key: process.env.CLOUDINARY_API_KEY , 
	  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.fs=fs;
    req.mongo = mongo;
    req.ownerEmail = ownerEmail;
    req.transporter = transporter;
    req.cloudinary = cloudinary;
    req.knox = knox;
    req.MSON = MSON;
    req.bucket = process.env.S3_BUCKET;
   // req.multipartyMiddleware = multipartyMiddleware;
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
