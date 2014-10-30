var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('impressum', {path: 'impressum', title: 'Impressum'});
});

module.exports = router;
