var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise');

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'pug');
app.use(express.static('public'));

var user = {}

app.get('/login', function (req, res) {
  res.render('login')
})

app.get('/', function (req, res) {
  if (user.type == null) return res.redirect('/login')
  if (user.type != 'admin') return res.redirect('/customers')
  res.render('home', { route: 'analytics', user:user });
})

app.get('/employees', function (req, res) {
  if (user.type == null) return res.redirect('/login')
  if (user.type != 'admin') return res.redirect('/customers')
  res.render('home', { route: 'employees', user:user });
})

app.get('/customers', function (req, res) {
  if (user.type == null) return res.redirect('/login')
  res.render('home', { route: 'customers', user:user });
})

app.get('/api/users', function (req, res) {

  request({
    uri: 'https://randomuser.me/api/',
    json: true
  })
  .then(function (response) {
    console.log(response.results)
    res.json({ users: [] })
  })
  .catch(e => {
    console.error(e)
    res.json({ users: [] })
  })

})

app.post('/login', function (req, res) {
  // login logic
  console.log(req.body)
  var email = req.body.email
  var pass = req.body.password
  user = {
    name: 'admin',
    type: req.body.email || 'admin'
  }
  res.redirect('/')
})
app.get('/logout', function (req, res) {
  user = {}
  res.redirect('/')
})

app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);
  console.log('p: 3000');
})
