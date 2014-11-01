var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var nav = [{
    name: "Persönliche Daten",
    href: "persoenliches",
    clss: "active"
  }, {
    name: "Ausbildungsweg",
    href: "ausbildung"
  }, {
    name: "Praktische Erfahrungen",
    href: "praxis"
  }, {
    name: "Zusätzliche Qualifikationen",
    href: "zusatz"
  }];
  res.render('resume', {path: 'resume', title: 'Lebenslauf', nav: nav});
});

module.exports = router;
