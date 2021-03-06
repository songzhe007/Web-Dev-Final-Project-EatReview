module.exports = function(app, passport) {
  var path = require('path');
  var auth = require('../config/auth');

  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);


  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

  app.get('/yelp/search', function(req, res) {
    var yelp = require('./yelp');
    yelp.search({term: req.query.term, location: req.query.location, limit: 10})
      .then(function (data) {
        var jsonObj = JSON.parse(data);
        res.json(data);
      })
      .catch(function (err) {
        console.error(err);
        res.json(500, err);
      });
  });

  // Reviews Routes
  var reviews = require('../controllers/reviews');
  app.get('/api/reviews', reviews.all);
  app.delete('/api/reviews', reviews.delete_review);
  app.post('/api/reviews/update', reviews.update_review);
  app.post('/api/reviews/store/*/create', reviews.create);

  // Users Routes
  var users = require('../controllers/users');
  app.get('/api/users', users.all);
  app.post('/api/users', users.update_all);
  app.delete('/api/users', users.delete_user);

  var profiles = require('../controllers/profiles');
  app.get('/api/profiles', profiles.all_reviews);
  app.get('/api/profiles/userinfo', profiles.fetch_userinfo);
  app.post('/api/profiles/userinfo', profiles.update_userinfo);

  // Angular Routes
  app.get('/views/partials/*', function(req, res) {
    console.log('angular routes');
    var requestedView = path.join('./', req.url);
    res.sendFile(requestedView);
  });


  app.get('/*', function(req, res) {
    console.log('/*');
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

 //   res.render('index.html');
    res.sendFile(path.join(__dirname + '/../../client/views/index.html'));
  });
}
