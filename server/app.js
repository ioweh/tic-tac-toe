var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes/index');

var port = 3000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../build')));

app.use('/', routes);

var server = http.createServer(app);
server.listen(port);
server.on('listening', function() {
    console.log('listening on port ' + port);
})

module.exports = app;
