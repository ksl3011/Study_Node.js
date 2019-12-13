var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var fileStore = require('session-file-store')(session)

var app = express()

//fileStore 파라미터값 추가가능 ->https://www.npmjs.com/package/session-file-store
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new fileStore()
}))
  
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  
  // get the url pathname
  var pathname = parseurl(req).pathname
  
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  
  next()
})
  
app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})
  
app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
 
app.listen(3000, function(){
    console.log('3000!');
});