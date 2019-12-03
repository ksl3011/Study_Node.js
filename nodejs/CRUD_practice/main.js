var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list
            , `<h2>${title}</h2>${description}`
            , `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list
              , `<h2>${title}</h2>${description}`
              , `<a href="/create">create</a>
              <a href="/update?title=${title}">update</a>
              <form method="post" action="/delete_process">
                <input type="hidden" name="title" value="${title}">
                <input type="submit" value="delete">
              </form>
              `);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,``);
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
        //console.log(body);//post로 받은 데이터 ..id=asd&pw=123..
      });
      request.on('end', function(data){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        //console.log(post);//json처럼 parse

        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(301, {Location : 'http://localhost:3000/'});
          response.end('success');
        });
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.title}`, 'utf8', function(err, description){
          var title = queryData.title;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
            <form action="/update_process" method="post">
              <input type="hidden" name="old_title" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `,``);
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(data){
        var post = qs.parse(body);
        var new_title = post.title;
        var old_title = post.old_title;
        var description = post.description;
        console.log(new_title + "=new_title");
        console.log(old_title + "=old_title");
        console.log(description + "=description");

        fs.rename(`data/${old_title}`,`data/${new_title}`,function(err){
          fs.writeFile(`data/${new_title}`, description, 'utf8', function(err){
            response.writeHead(301, {Location : `/?id=${new_title}`});
            response.end('success');
          });
        });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(data){
        var post = qs.parse(body);
        var title = post.title;

        fs.unlink(`data/${title}`, function(err){
          response.writeHead(301, {Location : '/'});
          response.end('success');
        })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }



});
app.listen(3000);
