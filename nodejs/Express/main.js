var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');

//express 보안1
var helmet = require('helmet');
app.use(helmet());

//express 라우터
var router = require('./router/router.js');
app.use('/', router);//router안의 주소는 '/'의 주소는 생략
                      //use('/topic', router) -> '/topic/main' > '/main'

//정적파일처리
//http://localhost:3000/test.png
//''에서 정적파일을 찾는다
app.use(express.static('images'));

//압축기능
var compression = require('compression');
app.use(compression());

//request에 body를 추가해서 내용물 출력기능
//사용시 post데이터 받을때 request.on사용 x
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// //미들웨어 = 함수
// app.use(function(req, res, next){
//   fs.readdir('./data', function(error, filelist){
//     req.f_list = filelist;
//     next();
//   });
// });

//get으로 받는 모든(*)요청에만 동작
//next는 다음실행 미들웨어(콜백)
app.get('*', function(req, res, next){
  fs.readdir('./data', function(error, filelist){
    req.f_list = filelist;
    console.log("req.f_list:");
    console.log(req.f_list);
    next();
  });
});

app.get('/create', function(req, res){
  //fs.readdir('./data', function(error, filelist){
    var title = 'WEB - create';
    //var list = template.list(filelist);
    var list = template.list(req.f_list);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    res.send(html);
  //});
});

app.post('/create_process', function(req, res){
  var body = req.body;
  var post = body.title;
  var description = body.description;
  fs.writeFile(`data/${post}`, description, 'utf8', function(err){
    res.writeHead(302, {Location: `/page/${post}`});
    res.end();
  });
  // var body = '';
  // req.on('data', function(data){
  //     body = body + data;
  // });
  // req.on('end', function(){
  //     var post = qs.parse(body);
  //     var title = post.title;
  //     var description = post.description;

  //     //console.log("body->" + body);
  //     //body->title=1&description=asd
      
  //     //console.log("qs.parse(body)->");
  //     //console.log(post);
  //     //[Object: null prototype] { title: '12d1', description: 'dd' }
      
  //     fs.writeFile(`data/${title}`, description, 'utf8', function(err){
  //       res.writeHead(302, {Location: `/page/${title}`});
  //       res.end();
  //     })
  //   });
});

app.get('/update/:id', function(req, res){
  //fs.readdir('./data', function(error, filelist){
    var filteredId = path.parse(req.params.id).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = filteredId;
      //var list = template.list(filelist);
      var list = template.list(req.f_list);
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
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      res.send(html);
    });
  //});
});

app.post('/update_process', function(req, res){
  var body = req.body;
  var id = body.id;
  var title = body.title;
  var description = body.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.writeHead(302, {Location: `/page/${title}`});
      res.end();
     });
  });

  // var body = '';
  // req.on('data', function(data){
  //     body = body + data;
  // });
  // req.on('end', function(){
  //     var post = qs.parse(body);
  //     var id = post.id;
  //     var title = post.title;
  //     var description = post.description;
  //     fs.rename(`data/${id}`, `data/${title}`, function(error){
  //       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
  //         res.writeHead(302, {Location: `/page/${title}`});
  //         res.end();
  //       });
  //     });
  //   });
});

app.post('/delete_process', function(req, res){
  var body = req.body;
  var id = body.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      res.writeHead(302, {Location: `/`});
      res.end();
    });

  // var body = '';
  // req.on('data', function(data){
  //     body = body + data;
  // });
  // req.on('end', function(){
  //     var post = qs.parse(body);
  //     var id = post.id;
  //     var filteredId = path.parse(id).base;
  //     fs.unlink(`data/${filteredId}`, function(error){
  //       res.writeHead(302, {Location: `/`});
  //       res.end();
  //     })
  // });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//에러처리 500
app.use(function(err, req, res, next){
  console.log("500에러");
  console.log(err.stack);
  res.status(500).send("500");
});

//에러처리 404
app.use(function(req, res, next){
  console.log("404에러");
  res.status(404).send("404");
});

/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
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
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/