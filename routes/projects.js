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
  
  repo_helper(["GitHub", "Bitbucket"], "GitHub", url, res, function(body) {
    return body;
  }, function(elem) {
    return {  name: elem['name'],
              url: elem['html_url'],
              lang: elem['language'],
              readme_url: "https://raw.github.com/"+elem['full_name']+"/"+elem['default_branch']+"/README.md"
           };
  });
});

router.get('/bitbucket', function(req, res) {
  var url = "https://bitbucket.org/api/2.0/repositories/hobbypunk";
  
  repo_helper(["GitHub", "Bitbucket"], "Bitbucket", url, res, function(body) {
    return body.values;
  }, function(elem) {
    return {  name: elem['name'],
              url: "https://bitbucket.com/" + elem['full_name'],
              lang: elem['language']
              //readme_url: "https://raw.github.com/"+elem['full_name']+"/"+elem['default_branch']+"/README.md"
           };
  });  
});

function repo_helper(hosts, host, url, res, func_getJSON, func_getValues) {
  console.log("Start " + host + " Sequence");
  sequence.then(function(next) {
    console.log("Start " + host + " Request");
    request.get({url: url, json: true, headers:{ 'User-Agent': 'curl/7.38.0'}}, function(error, response, body) {
      console.log(host + "Request ready");
      if (!error && response.statusCode === 200) {
        next(func_getJSON(body)); 
      } else {
        if(error == undefined) error = { 'status': response.statusCode, 'stack': ''};
        res.render('error', {path: 'projects', title: 'Meine Projekte auf ' + host, error: error });
        next();
      }
    });
  }).then(function(next, body) {
    if(body === undefined) next();
    var repos = [];
    body.forEach(function(elem, index) {
      repos[index] = func_getValues(elem);
    });
    next(repos);
  }).then(function(next, repos) {
    if(repos === undefined) next();
    console.log(repos);
    res.render('projects', {path: 'projects', title: 'Meine Projekte auf '+ host, repos: repos, host: host, hosts: hosts});
    next();
  });
}

module.exports = router;
