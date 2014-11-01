var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var nav = [{
    name: "Impressum",
    href: "impressum",
    clss: "active"
  }, {
    name: "Haftungsausschluss",
    href: "disclaimer"
  }, {
    name: "Datenschutzerklärung",
    href: "privacy"
  }];
  res.render('impressum', {path: 'impressum', title: 'Impressum', nav: nav});
});

module.exports = router;
