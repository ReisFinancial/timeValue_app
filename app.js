var express = require('express');
var path = require('path');
var stormpath = require('express-stormpath');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(stormpath.init(app, {
  debug: 'info, error'
}));

app.use(stormpath.init(app, {
  // Optional configuration options.
  website: true
}));

app.get('/secret', function (req, res) {
  var client = req.app.get('stormpathClient');

  // For example purposes only -- you probably don't want to actually expose
  // this information to your users =)
  client.getCurrentTenant(function (err, tenant) {
    if (err) {
      return res.status(400).json(err);
    }

    res.json(tenant);
  });
});

// Once Stormpath has initialized itself, start your web server!
app.on('stormpath.ready', function () {
  app.listen(3000);
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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


module.exports = app;
