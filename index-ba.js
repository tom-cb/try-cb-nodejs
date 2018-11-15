'use strict';

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
  }));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/login', function (req, res) {
    res.render('login');    
});

app.post('/login', function (req, res){
    // var username = req.body.username;
    // var password = req.body.password;
    var username = 'admin';
    var password = 'password';

    request.get(`http://${username}:${password}@34.246.168.50:4984/cards/`, function(error, response) {
        if (response.statusCode === 401) {
            res.redirect('/login');
        } else {
            // create a session
            // let user = {username: username, password: password};
            // req.session.user = user;
            res.redirect('/cards');
        }
    });

  });

app.get('/cards', function(req, res) {

    console.log(req.session.user)

        // request.get('http://34.246.168.50:4984/cards', function(error, response) {
        //     if (response.statusCode === 401) {
        //         res.redirect('/login');
        //     } else {
        //         res.redirect('/cards');
        //     }
        // });
});

// Main entry point, for now:
app.get('/cards/:id', function(req, res) {
    // var card = req.params.card;
    // var user = req.params.user;
    let username = 'admin';
    let password = 'password';

    request.get(`http://${username}:${password}@34.246.168.50:4984/cards/${req.params.id}`, function(error, response) {

        res.render('card', { body:  response.body, user: username}, function(err, html) {
            res.send(html)
          });

        // if (response.statusCode === 401) {
        //     res.redirect('/login');
        // } else {
        //     res.redirect('/cards');
        // }
    });
});

app.listen(8080, function () {
    console.log('BA web app listening on port 8080!');
});