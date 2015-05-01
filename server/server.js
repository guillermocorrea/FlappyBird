/**
 * Created by LuisGuillermo on 5/1/2015.
 */
'use strict';
/*var express = require('express');
var Path = require('path');

var app = express();
app.use('static', Path.join(__dirname, '../front'));

var port = process.env.PORT || 3000;
var router = express.Router();
router.get('/', function (req, res) {
    res.send(200);
});
app.use('', router);

var server = app.listen(port, function () {
    var host = server.address().address;
    console.log('Example app listening at http://%s:%s', host, port);
});*/

var express = require('express');
var app = express();
var Path = require('path');

app.use(express.static(Path.join(__dirname, '../front')));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});