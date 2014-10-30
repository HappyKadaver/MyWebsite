var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('resume', {path: 'resume', title: 'Lebenslauf'});
});

module.exports = router;
