var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var session = require('express-session');
var fileStore = require('session-file-store')(session);

var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new fileStore()
}))

var loginData = {
  'id':'asd',
  'pw':'asd'
}

var auth = function(req, res){
  var isLogin = false;
  if(req.session.isLogined){
      isLogin = true;
  }
  return isLogin;
}

var authUI = `<a href="/login">login</a>`;

app.use('*', function(req, res, next){
  var isLogin = auth(req, res);
  if(isLogin){
    authUI = `<a href="/logout_process">logout</a>`;
  }
  console.log(isLogin);
  next();
});

app.get('/', function (req, res, next) {
    fs.readdir('./data', function(error, filelist){
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`,
        authUI
      );
      res.send(html);
    });
  });

app.get('/:id', function (req, res, next) {
    var filteredId = path.parse(req.params.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      fs.readdir('./data', function(error, filelist){
      var title = req.params.id;
      console.log(title);
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(filelist);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`,
          authUI
      );
      res.writeHead(200);
      res.end(html);
    });
  });
});

app.get('/create', function (req, res, next) {
 
    res.end('');
 
});

app.post('/create_process', function (req, res, next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.writeHead(302, {Location: `/${title}`});
        res.end();
      })
  });
});

app.get('/update/:id', function (req, res, next) {
  fs.readdir('./data', function(error, filelist){
    var filteredId = path.parse(res.params.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = queryData.id;
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`,
        authUI
      );
      res.writeHead(200);
      res.end(html);
    });
  });
});

app.get('/update_process', function (req, res, next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          res.writeHead(302, {Location: `/${title}`});
          res.end();
        })
      });
  });
});

app.get('/delete_process', function (req, res, next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        res.writeHead(302, {Location: `/`});
        res.end();
      })
  });
});

app.get('/login', function (req, res, next) {
  fs.readdir('./data', function(error, filelist){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<form method="post" action="/login_process">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>`,
      `<a href="/create">create</a>`,
      authUI
    );
    res.writeHead(200);
    res.end(html);
  });
});

app.get('/login_process', function (req, res, next) {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var demail = post.email;
      var email = path.parse(demail).base;
      if(post.email === loginData.id && post.password === loginData.pw){
        req.session.isLogined = true;
        req.session.id = `${post.email}`;
        req.session.id = `${post.password}`;
        res.writeHead(302, {Location: '/'});
        res.end();
      }else{
        console.log("x");
        res.writeHead(302, {Location:'/'})
      }
  });
});

app.get('/logout_process', function (req, res, next) {
  res.writeHead(302, {Location: '/'});
  res.end();
});

app.listen(3000);
