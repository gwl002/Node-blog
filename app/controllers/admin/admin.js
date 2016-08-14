var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post= mongoose.model('Post');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/admin', function (req, res, next) {
  res.redirect("/admin/posts")
});