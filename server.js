var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/sw.js', function(req, res){
    res.sendFile(__dirname + '/sw.js')
});

app.get('/js/main.js', function(req, res){
    res.sendFile(__dirname + '/js/main.js');
});

app.get('/manifest.json', function(req, res){
    res.sendFile(__dirname + '/manifest.json');
});

var port = process.env.PORT || 5000;

app.listen(port, function(err) {
    if (err) console.error(err);
    else console.info("Server is running: ", port);
});
