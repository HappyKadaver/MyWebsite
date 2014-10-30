var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var Sequence = exports.Sequence || require('sequence').Sequence , sequence = Sequence.create()

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/projects/github');
});

router.get('/github', function(req, res) {
  var url = "https://api.github.com/users/hobbypunk90/repos";
  sequence.then(function(next) {
    console.log("Start GitHub Request");
    request.get({url: url, json: true, headers:{ 'User-Agent': 'curl/7.38.0'}}, function (error, response, body) {
      console.log("GitHub Request ready");
      if (!error && response.statusCode === 200) {
        next(body); 
      } else {
        if(error == undefined) error = { 'status': response.statusCode, 'stack': ''};
        res.render('error', {path: 'projects', title: 'Meine Projekte auf GitHub', error: error });
        next();
      }
    });
  }).then(function(next, body) {
    if(body === undefined) next();
    var repos = [];
    body.forEach(function(elem, index) {
      repos[index] = {  name: elem['name'],
                        url: elem['html_url'],
                        lang: elem['language']
                        //readme_url: "https://raw.github.com/"+elem['full_name']+"/"+elem['default_branch']+"/README.md"
                      };
    });
    next(repos);
  }).then(function(next, repos) {
    if(repos === undefined) next();
    console.log(repos);
    res.render('repos', {path: 'projects', title: 'Meine Projekte auf GitHub' , repos: repos, host: "github"});
    next();
  });
});

router.get('/bitbucket', function(req, res) {
  var url = "https://bitbucket.org/api/2.0/repositories/hobbypunk";
  console.log("Start Bitbucket Sequence");
  sequence.then(function(next) {
    console.log("Start Bitbucket Request");
    request.get({url: url, json: true}, function(error, response, body) {
      console.log("Bitbucket Request ready");
      if (!error && response.statusCode === 200) {
        next(body.values); 
      } else {
        if(error == undefined) error = { 'status': response.statusCode, 'stack': ''};
        res.render('error', {path: 'projects', title: 'Meine Projekte auf GitHub', error: error });
        next();
      }
    });
  }).then(function(next, body) {
    if(body === undefined) next();
    var repos = [];
    body.forEach(function(elem, index) {
      repos[index] = {  name: elem['name'],
                        url: "https://bitbucket.com/" + elem['full_name'],
                        lang: elem['language']
                        //readme_url: "https://raw.github.com/"+elem['full_name']+"/"+elem['default_branch']+"/README.md"
                      };
    });
    next(repos);
  }).then(function(next, repos) {
    if(repos === undefined) next();
    console.log(repos);
    res.render('repos', {path: 'projects', title: 'Meine Projekte auf Bitbucket' , repos: repos, host: "bitbucket"});
    next();
  });
});

module.exports = router;
