var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    //console.log("_url = " + _url);
    var queryData = url.parse(_url, true).query;
    //console.log(queryData);
    var title = queryData.id;
    if(_url == '/'){
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);

    /*
    함수 파라미터 위치중요
    파일을 페이지를 열때마다 불러와 읽기 때문에 갱신위해 main.js 재시작 불필요
    */
    fs.readFile(`${queryData.id}`, 'utf8', function(err, data){
      //console.log(`${queryData.id}`);
      var description = data;
      var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
      `;
      response.end(template);
    });

});
app.listen(3000);
