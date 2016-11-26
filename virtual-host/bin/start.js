/**
 * Created by KSTN-NAM on 26/11/2016.
 */
var http = require('http');
var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var proxy = {
    'localhost1.com': {
        domain: 'ketnoitienganh.com',
        protocol: 'http'
    },
    'localhost2.com': {
        domain: 'kstndev.com',
        protocol: 'https'
    }
};
app.use('*', function (req, res) {
    var host = req.headers.host;
    if (proxy[host]) {
        var headers = req.headers;
        var method = req.method;
        var body = req.body;
        var url=proxy[host].protocol+'://'+proxy[host].domain+req.originalUrl;
        if (method == 'POST') {
            console.log(url);
            console.log(body);
        }
        headers.host = proxy[host].domain;
        var options = {
            url: url,
            method: method,
            headers: headers,
            form: body
        };
        request(options).pipe(res);
    }
});
http.createServer(app).listen(80);
