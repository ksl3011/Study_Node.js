var express = require('express');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var fs = require('fs');

var router = express.Router();

router.get('*', function(req, res, next){
    fs.readdir('./data', function(error, filelist){
      req.f_list = filelist;
      console.log("req.f_list:");
      console.log(req.f_list);
      next();
    });
  });

router.get('/', function (req, res) {
    //fs.readdir('./data', function(error, filelist){
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      //var list = template.list(filelist);
      var list = template.list(req.f_list);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <br><img src="test.png">`,
        `<a href="/create">create</a>`
      );
      res.send(html);
    //});
  });
  
  router.get('/page/:pageId', function(request, response, next) {
    //fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
          //에러가 true면 다음 미들웨어호출
          //인자가 있으면 err, req, res, next 4개가 있는 미들웨어 호출
          next(err);
        }else{
          var title = request.params.pageId;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          });
          //var list = template.list(filelist);
          var list = template.list(request.f_list);
          var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
              <a href="/update/${sanitizedTitle}">update</a>
              <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
          );
          response.send(html);
        }
      });
    //});
  });

  module.exports = router;