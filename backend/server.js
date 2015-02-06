/**
 * Module dependencies.
 */

var express         = require('express'),
    bodyParser      = require('body-parser'),
    compression     = require('compression'),
    cookieParser    = require('cookie-parser'),
    methodOverride  = require('method-override'),
    session         = require('express-session'),
    morgan          = require('morgan'),
    errorhandler    = require('errorhandler'),
    favicon         = require('serve-favicon'),
    path            = require('path'),
    passport        = require('passport'),
    redis           = require("connect-redis"),
    serverConfig    = require('./config/server'),
    redisConfig     = require('./config/redis'),
    dbConfig        = require('./config/database'),
    mailConfig      = require('./config/smtp'),
    frontendConfig  = require('./config/frontend'),
    utils           = require('./utils'),
    router, cfg, models, passportConfig, RedisStore, store, rediscfg;

/**
* Base configs
*/

cfg = utils.reqJSONFile('cfg.json' || undefined);

dbConfig.set(cfg && cfg.db);
redisConfig.set(cfg && cfg.redis);
mailConfig.set(cfg && cfg.smtp);

rediscfg = redisConfig.config();

/**
* Loading models and services
*/

//This code goes here because config must be loaded before to call to this modules
router = require('./config/routes'),
models = require('./models');


/**
 * Config passport
 */

passportConfig  = require('./config/passport'),
passportConfig(passport);


/**
 * Create Express server.
 */

var app = express();

/**
 * Load Redis
 */

RedisStore = redis(session);

store = new RedisStore({
    host : rediscfg.host,
    port : rediscfg.port,
    pass : rediscfg.password
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var month = (day * 30);


app.set('port', serverConfig.port);
app.use(compression());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header('X-UA-Compatible', 'IE=edge');
    next();
});
//app.use(favicon('frontend/public/img/favicon.ico'));
app.use('/static', express.static(path.join(__dirname, frontendConfig.public), { maxAge: day }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ 
    store             : store, 
    secret            : 'ilovepotatoes',
    cookie            : { maxAge: 6 * month },
    saveUninitialized : true,
    resave            : true,
    unset             : 'destroy'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    req.passport = passport;
    next();
});
app.use(errorhandler());


/**
* Routes
**/

router(app);


/**
 * Start Express server.
 */

models.sequelize.sync().complete(function (err) {
    if(err) throw err;

    app.listen(app.get('port'), function() {
        console.log('✔ FicoNet server listening on port %d', app.get('port'));
    });
});

module.exports = app;