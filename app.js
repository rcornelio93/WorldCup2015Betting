
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var home = require('./routes/home');

var app = express();

// all environments
app.set('port', process.env.PORT || 6050);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.signin);
app.get('/users', user.list);
app.get('/mybetting', home.myBetting);
app.get('/displaybets/:id', home.displayBets);
app.get('/homepage', home.homepage);
app.post('/homepage', home.homepage);
app.post('/enterbets', home.enterBet);
app.post('/placebet', home.placeBet);
app.get('/logout', home.logOut);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
